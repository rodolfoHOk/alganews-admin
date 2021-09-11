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
} from 'antd';
import { Payment } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';
import moment, { Moment } from 'moment';
import useForm from 'antd/lib/form/hooks/useForm';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CurrencyInput from '../components/CurrencyInput';

const { TabPane } = Tabs;

export default function PaymentForm() {
  const [form] = useForm<Payment.Input>();
  const { editors } = useUsers();

  return (
    <Form<Payment.Input>
      form={form}
      layout="vertical"
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
                  {'Daniel Bonifácio'}
                </Descriptions.Item>
                <Descriptions.Item label="Período">
                  {'01/05/2021 à 01/06/2021'}
                </Descriptions.Item>
                <Descriptions.Item label="Agendamento">
                  {'27/05/2021'}
                </Descriptions.Item>
                <Descriptions.Item label="Palavras">{'685'}</Descriptions.Item>
                <Descriptions.Item label="Ganhos">
                  {'R$ 23.432,00'}
                </Descriptions.Item>
                {[1, 2].map((bonus) => {
                  return (
                    <Descriptions.Item label={`Bônus ${bonus}`}>
                      {'R$ 7.500,00'}
                    </Descriptions.Item>
                  );
                })}
                <Descriptions.Item label="Ganhos de Posts">
                  {'R$ 7.432,00'}
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
                  {'341'}
                </Descriptions.Item>
                <Descriptions.Item label="Número da conta">
                  {'1065160'}
                </Descriptions.Item>
                <Descriptions.Item label="Dígito da conta">
                  {'8'}
                </Descriptions.Item>
                <Descriptions.Item label="Agência">{'0001'}</Descriptions.Item>
                <Descriptions.Item label="Tipo de conta">
                  {'Conta Corrente'}
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
                      <Row gutter={24}>
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
