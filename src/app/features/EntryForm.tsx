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
  Skeleton,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import CurrencyInput from '../components/CurrencyInput';
import moment, { Moment } from 'moment';
import { useForm } from 'antd/lib/form/Form';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';
import useCashFlow from '../../core/hooks/useCashFlow';
import Forbidden from '../components/Forbidden';

type FormType = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

interface EntryFormProps {
  type: 'EXPENSE' | 'REVENUE';
  editingEntry?: number | undefined;
  onSuccess: () => any;
  onCancel: () => any;
}

export default function EntryForm({
  type,
  editingEntry,
  onSuccess,
  onCancel,
}: EntryFormProps) {
  const [form] = useForm();
  const { expenses, revenues, fetching, fetchCategories } =
    useEntriesCategories();
  const {
    createEntry,
    fetching: fetchingEntries,
    updateEntry,
  } = useCashFlow(type);

  const [loading, setLoading] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchCategories().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchCategories]);

  useEffect(() => {
    if (editingEntry) {
      setLoading(true);
      CashFlowService.getExistingEntry(editingEntry)
        .then((entry) => ({
          ...entry,
          transactedOn: moment(entry.transactedOn),
        }))
        .then(form.setFieldsValue)
        .finally(() => setLoading(false));
    }
  }, [editingEntry, form.setFieldsValue]);

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

      editingEntry
        ? await updateEntry(editingEntry, newEntryDto)
        : await createEntry(newEntryDto);

      onSuccess();
    },
    [type, editingEntry, createEntry, updateEntry, onSuccess]
  );

  if (forbidden) return <Forbidden />;

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
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
            label={type === 'EXPENSE' ? 'Data da saída' : 'Data da entrada'}
            name="transactedOn"
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              disabledDate={(date) => {
                return date.isAfter(moment());
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0 }} />
      <Row justify="end">
        <Space>
          <Button type="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={fetchingEntries}>
            {`${editingEntry ? 'Atualizar' : 'Cadastrar'} ${
              type === 'EXPENSE' ? 'despesa' : 'receita'
            }`}
          </Button>
        </Space>
      </Row>
    </Form>
  );
}
