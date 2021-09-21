import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Divider,
  Space,
  Button,
  Select,
} from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import CurrencyInput from '../components/CurrencyInput';
import { Moment } from 'moment';
import { useForm } from 'antd/lib/form/Form';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import useCashFlow from '../../core/hooks/useCashFlow';

type FormType = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

interface EntryFormProps {
  type: 'EXPENSE' | 'REVENUE';
  onSuccess: () => any;
}

export default function EntryForm({ type, onSuccess }: EntryFormProps) {
  const [form] = useForm();

  const { expenses, revenues, fetching, fetchCategories } =
    useEntriesCategories();

  const { createEntry, fetching: fetchingEntries } = useCashFlow(type);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categories = useMemo(
    () => (type === 'EXPENSE' ? expenses : revenues),
    [type, expenses, revenues]
  );

  const handleFormSubmit = useCallback(
    async (form: FormType) => {
      const newEntryDto: CashFlow.EntryInput = {
        ...form,
        transactedOn: form.transactedOn.format('YYYY-MM-DD'),
        type,
      };

      await createEntry(newEntryDto);

      onSuccess();
    },
    [type, createEntry, onSuccess]
  );

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
            <Select loading={fetching} placeholder="Selecione uma categoria">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
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
          <Button type="primary" htmlType="submit" loading={fetchingEntries}>
            {type === 'EXPENSE' ? 'Cadastrar despesa' : 'Cadastrar receita'}
          </Button>
        </Space>
      </Row>
    </Form>
  );
}
