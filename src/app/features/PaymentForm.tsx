import {
  Col,
  Form,
  Row,
  Select,
  DatePicker,
  Button,
  Input,
  Tabs,
  Typography,
  Divider,
  Descriptions,
  Space,
  Tooltip,
  Skeleton,
  notification,
  TabsProps,
} from 'antd';
import { Payment } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';
import moment, { Moment } from 'moment';
import useForm from 'antd/lib/form/hooks/useForm';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';
import CurrencyInput from '../components/CurrencyInput';
import { useCallback, useEffect, useState } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';
import debounce from 'lodash.debounce';
import usePayment from '../../core/hooks/usePayment';
import formatToBrl from '../../core/utils/formatToBrl';
import NullPaymentPreview from '../components/NullPaymentPreview';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';
import { BusinessError } from 'rodolfohiok-sdk/dist/errors';
import { useNavigate } from 'react-router-dom';

export default function PaymentForm() {
  const navigate = useNavigate();
  const [form] = useForm<Payment.Input>();
  const { editors, fetchUsers, fetching } = useUsers();
  const {
    paymentPreview,
    fetchPaymentPreview,
    clearPaymentPreview,
    fetchingPaymentPreview,
    schedulePayment,
    schedulingPayment,
  } = usePayment();
  const [scheduledTo, setScheduleTo] = useState('');
  const [paymentPreviewError, setPaymentPreviewError] = useState<CustomError>();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateScheduleDate = useCallback(() => {
    const { scheduledTo } = form.getFieldsValue();
    setScheduleTo(scheduledTo);
  }, [form]);

  const clearPaymentPreviewError = useCallback(() => {
    setPaymentPreviewError(undefined);
  }, []);

  const getPaymentPreview = useCallback(async () => {
    const { payee, accountingPeriod, bonuses } = form.getFieldsValue();
    if (payee && accountingPeriod) {
      if (payee.id && accountingPeriod.startsOn && accountingPeriod.endsOn) {
        try {
          await fetchPaymentPreview({
            payee,
            accountingPeriod,
            bonuses: bonuses || [],
          });
          clearPaymentPreviewError();
        } catch (error) {
          clearPaymentPreview();
          if (error instanceof BusinessError) setPaymentPreviewError(error);
          throw error;
        }
      } else {
        clearPaymentPreview();
        clearPaymentPreviewError();
      }
    }
  }, [
    form,
    fetchPaymentPreview,
    clearPaymentPreview,
    clearPaymentPreviewError,
  ]);

  const handleFormChange = useCallback(
    ([field]: FieldData[]) => {
      if (Array.isArray(field?.name)) {
        if (
          field.name.includes('payee') ||
          field.name.includes('_accountingPeriod') ||
          field.name.includes('bonuses')
        ) {
          getPaymentPreview();
        }

        if (field.name.includes('scheduledTo')) {
          updateScheduleDate();
        }
      }
    },
    [getPaymentPreview, updateScheduleDate]
  );

  const debouncedHandleFormChange = debounce(handleFormChange, 1000);

  const handleFormSubmit = useCallback(
    async (form: Payment.Input) => {
      const paymentDto: Payment.Input = {
        accountingPeriod: form.accountingPeriod,
        payee: form.payee,
        bonuses: form.bonuses || [],
        scheduledTo: moment(form.scheduledTo).format('YYYY-MM-DD'),
      };

      await schedulePayment(paymentDto);

      notification.success({
        message: 'Pagamento agendado com sucesso',
      });

      navigate('/pagamentos');
    },
    [schedulePayment, navigate]
  );

  const items: TabsProps['items'] = [
    {
      key: 'payment',
      label: 'Demonstrativo',
      children: (
        <Descriptions
          column={1}
          labelStyle={{ width: 160 }}
          bordered
          size="small"
        >
          <Descriptions.Item label="Editor">
            {paymentPreview?.payee.name}
          </Descriptions.Item>
          <Descriptions.Item label="Período">
            {paymentPreview?.accountingPeriod && (
              <Space>
                {moment(paymentPreview?.accountingPeriod.startsOn).format(
                  'DD/MM/YYYY'
                )}
                <span>à</span>
                {moment(paymentPreview?.accountingPeriod.endsOn).format(
                  'DD/MM/YYYY'
                )}
              </Space>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Agendamento">
            {scheduledTo && moment(scheduledTo).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Palavras">
            {paymentPreview?.earnings.words}
          </Descriptions.Item>
          <Descriptions.Item label="Ganhos">
            {formatToBrl(paymentPreview?.grandTotalAmount)}
          </Descriptions.Item>
          {paymentPreview?.bonuses.map((bonus, index) => {
            return (
              <Descriptions.Item
                label={
                  <Space>
                    {`Bônus ${index + 1}`}
                    <Tooltip title={bonus.title}>
                      <InfoCircleFilled style={{ color: '#09F' }} />
                    </Tooltip>
                  </Space>
                }
                key={index}
              >
                {formatToBrl(bonus.amount)}
              </Descriptions.Item>
            );
          })}
          <Descriptions.Item label="Ganhos de Posts">
            {formatToBrl(paymentPreview?.earnings.totalAmount)}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'bankAccount',
      label: 'Dados Bancários',
      children: (
        <Descriptions
          column={1}
          labelStyle={{ width: 160 }}
          bordered
          size="small"
        >
          <Descriptions.Item label="Código do banco">
            {paymentPreview?.bankAccount.bankCode}
          </Descriptions.Item>
          <Descriptions.Item label="Número da conta">
            {paymentPreview?.bankAccount.number}
          </Descriptions.Item>
          <Descriptions.Item label="Dígito da conta">
            {paymentPreview?.bankAccount.digit}
          </Descriptions.Item>
          <Descriptions.Item label="Agência">
            {paymentPreview?.bankAccount.agency}
          </Descriptions.Item>
          <Descriptions.Item label="Tipo de conta">
            {paymentPreview?.bankAccount.type === 'CHECKING'
              ? 'Conta corrente'
              : 'Conta poupança'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return (
    <Form<Payment.Input>
      form={form}
      layout="vertical"
      onFieldsChange={debouncedHandleFormChange}
      onFinish={handleFormSubmit}
    >
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Form.Item
            label="Editor"
            name={['payee', 'id']}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <Select
              showSearch
              loading={fetching}
              placeholder={
                fetching ? 'Carregando editores...' : 'Selecione um editor'
              }
              filterOption={(input, option) =>
                option!
                  .children!.toString()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0 ||
                option!
                  .children!.toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {editors.map((editor) => (
                <Select.Option key={editor.id} value={editor.id}>
                  {editor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item hidden name={['accountingPeriod', 'startsOn']}>
            <Input hidden />
          </Form.Item>
          <Form.Item hidden name={['accountingPeriod', 'endsOn']}>
            <Input hidden />
          </Form.Item>
          <Form.Item
            label="Período"
            name="_accountingPeriod"
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
              onChange={(date) => {
                if (date !== null) {
                  const [startsOn, endsOn] = date as unknown as Moment[];
                  form.setFieldsValue({
                    accountingPeriod: {
                      startsOn: startsOn.format('YYYY-MM-DD'),
                      endsOn: endsOn.format('YYYY-MM-DD'),
                    },
                  });
                } else {
                  form.setFieldsValue({
                    accountingPeriod: {
                      startsOn: undefined,
                      endsOn: undefined,
                    },
                  });
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item
            label="Agendamento"
            name="scheduledTo"
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
              disabledDate={(date) => {
                return (
                  date.isBefore(moment().toString()) ||
                  date.isAfter(moment().add(7, 'days').toString())
                );
              }}
            />
          </Form.Item>
        </Col>
        <Divider />
        <Col xs={24} lg={12}>
          {fetchingPaymentPreview ? (
            <>
              <Skeleton />
              <Skeleton title={false} />
            </>
          ) : !paymentPreview ? (
            <NullPaymentPreview error={paymentPreviewError} />
          ) : (
            <Tabs defaultActiveKey={'payment'} items={items} />
          )}
        </Col>
        <Col xs={24} lg={12}>
          <Typography.Title level={4}>Bônus</Typography.Title>
          <Form.List name="bonuses">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field) => {
                    return (
                      <Row gutter={24} key={field.name}>
                        <Col xs={24} lg={14}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'title']}
                            label="Descrição"
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              },
                            ]}
                          >
                            <Input placeholder="E.g.: 1 milhão de views" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={6}>
                          <Form.Item
                            {...field}
                            name={[field.name, 'amount']}
                            initialValue={0}
                            label="Valor"
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              },
                            ]}
                          >
                            <CurrencyInput
                              onChange={(e, amount) => {
                                const { bonuses } = form.getFieldsValue();
                                form.setFieldsValue({
                                  bonuses: bonuses?.map((bonus, index) => {
                                    return index === field.name
                                      ? { title: bonus.title, amount }
                                      : bonus;
                                  }),
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={4}>
                          <Form.Item label="Remover">
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => remove(field.name)}
                              danger
                              size="small"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Adicionar bônus
                  </Button>
                </>
              );
            }}
          </Form.List>
        </Col>
      </Row>
      <Row justify="end">
        <Button type="primary" htmlType="submit" loading={schedulingPayment}>
          Cadastrar agendamento
        </Button>
      </Row>
    </Form>
  );
}
