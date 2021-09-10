import { Col, Form, Row, Select, DatePicker } from 'antd';
import { Payment } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';

export default function PaymentForm() {
  const { editors } = useUsers();

  return (
    <Form<Payment.Input> layout="vertical">
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Form.Item label="Editor">
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
          <Form.Item label="Período">
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD-MM-YYYY"
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item label="Agendamento">
            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
