import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Divider,
  Space,
  Button,
} from 'antd';
import { useCallback } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import CurrencyInput from '../components/CurrencyInput';
import { Moment } from 'moment';
import { useForm } from 'antd/lib/form/Form';

type FormType = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

export default function EntryForm() {
  const [form] = useForm();

  const handleFormSubmit = useCallback((form: FormType) => {
    console.log(form);
  }, []);

  return (
    <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="Descrição"
            name="description"
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Input placeholder="E.g.: Pagamento da AWS" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            label="Categoria"
            name={['category', 'id']}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label="Montante"
            name="amount"
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
            initialValue={0}
          >
            <CurrencyInput
              onChange={(_event, value) =>
                form.setFieldsValue({
                  amount: value,
                })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label="Data de entrada"
            name="transactedOn"
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row justify="end">
        <Space>
          <Button type="default">Cancelar</Button>
          <Button type="primary" htmlType="submit">
            Cadastrar despesa
          </Button>
        </Space>
      </Row>
    </Form>
  );
}
