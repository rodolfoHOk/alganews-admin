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
import { useCallback } from 'react';
import { FieldData } from 'rc-field-form/lib/interface';
import debounce from 'lodash.debounce';
import usePayment from '../../core/hooks/usePayment';
import formatToBrl from '../../core/utils/formatToBrl';

const { TabPane } = Tabs;

export default function PaymentForm() {
  const [form] = useForm<Payment.Input>();
  const { editors } = useUsers();
  const { paymentPreview, fetchPaymentPreview } = usePayment();

  const getPaymentPreview = useCallback(() => {
    const { payee, accountingPeriod, bonuses } = form.getFieldsValue();
    if (payee.id && accountingPeriod.startsOn && accountingPeriod.endsOn) {
      fetchPaymentPreview({
        payee,
        accountingPeriod,
        bonuses: bonuses || [],
      });
    }
  }, [form, fetchPaymentPreview]);

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
      }
    },
    [getPaymentPreview]
  );

  const debouncedHandleFormChange = debounce(handleFormChange, 1000);

  return (
    <Form<Payment.Input>
      form={form}
      layout="vertical"
      onFieldsChange={debouncedHandleFormChange}
      onFinish={(form) => console.log(form)}
    >
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Form.Item label="Editor" name={['payee', 'id']}>
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0 ||
                (option?.children as string)
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
          <Form.Item label="Período" name="_accountingPeriod">
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
              onChange={(date) => {
                if (date !== null) {
                  const [startsOn, endsOn] = date as Moment[];
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
          <Form.Item label="Agendamento" name="scheduleTo">
            <DatePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
              disabledDate={(date) => {
                return (
                  date.isBefore(moment()) ||
                  date.isAfter(moment().add(7, 'days'))
                );
              }}
            />
          </Form.Item>
        </Col>
        <Divider />
        <Col xs={24} lg={12}>
          <Tabs defaultActiveKey={'payment'}>
            <TabPane tab="Demonstrativo" key="payment">
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
                  <Space>
                    {moment(paymentPreview?.accountingPeriod.startsOn).format(
                      'DD/MM/YYYY'
                    )}
                    <span>à</span>
                    {moment(paymentPreview?.accountingPeriod.endsOn).format(
                      'DD/MM/YYYY'
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Agendamento">
                  {form.getFieldsValue()['scheduledTo']}
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
            </TabPane>
            <TabPane tab="Dados Bancários" key="bankAccount">
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
            </TabPane>
          </Tabs>
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
      <Button htmlType="submit">enviar</Button>
    </Form>
  );
}
