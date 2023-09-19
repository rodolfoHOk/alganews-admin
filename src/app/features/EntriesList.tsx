import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Card,
  DatePicker,
  notification,
  Descriptions,
} from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import formatToBrl from '../../core/utils/formatToBrl';
import DoubleConfirm from '../components/DoubleConfirm';
import { useNavigate, useLocation } from 'react-router-dom';
import Forbidden from '../components/Forbidden';

interface EntriesListProps {
  type: 'EXPENSE' | 'REVENUE';
  onEdit: (entryId: number) => any;
  onDetail: (entryId: number) => any;
}

export default function EntriesList(props: EntriesListProps) {
  const { type } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const {
    entries,
    fetchEntries,
    fetching,
    setQuery,
    selected,
    setSelected,
    deleteEntry,
  } = useCashFlow(type);

  const didMount = useRef(false);

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchEntries().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchEntries]);

  useEffect(() => {
    if (didMount.current) {
      const params = new URLSearchParams(location.search);
      const yearMonth = params.get('yearMonth');
      if (yearMonth) setQuery({ yearMonth });
    } else {
      didMount.current = true;
    }
  }, [location.search, setQuery]);

  if (forbidden) return <Forbidden />;

  return (
    <Table<CashFlow.EntrySummary>
      loading={fetching}
      dataSource={entries}
      rowKey="id"
      rowSelection={{
        selectedRowKeys: selected,
        onChange: setSelected,
        getCheckboxProps(record) {
          return !record.canBeDeleted ? { disabled: true } : {};
        },
      }}
      columns={[
        {
          title: type === 'EXPENSE' ? 'Despesa' : 'Receita',
          responsive: ['xs'],
          render(entry: CashFlow.EntrySummary) {
            return (
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Descrição">
                  {entry.description}
                </Descriptions.Item>
                <Descriptions.Item label="Categoria">
                  {entry.category.name}
                </Descriptions.Item>
                <Descriptions.Item label="Data">
                  {moment(entry.transactedOn).format('DD/MM/YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Valor">
                  {formatToBrl(entry.amount)}
                </Descriptions.Item>
                <Descriptions.Item label="Ações">
                  <Space>
                    <DoubleConfirm
                      popConfirmTitle={
                        type === 'EXPENSE'
                          ? 'Remover despesa?'
                          : 'Remover receita?'
                      }
                      modalTitle={`Deseja mesmo remover esta ${
                        type === 'EXPENSE' ? 'despesa' : 'receita'
                      }?`}
                      modalContent={`Remover uma ${
                        type === 'EXPENSE' ? 'despesa' : 'receita'
                      } pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível`}
                      onConfirm={async () => {
                        await deleteEntry(entry.id);
                        notification.success({
                          message: `${
                            type === 'EXPENSE' ? 'Despesa' : 'Receita'
                          } removida com sucesso`,
                        });
                      }}
                      disabled={!entry.canBeDeleted}
                    >
                      <Tooltip title="Remover" placement="left">
                        <Button
                          type="text"
                          size="small"
                          loading={fetching}
                          icon={<DeleteOutlined />}
                          disabled={!entry.canBeDeleted}
                          danger
                        />
                      </Tooltip>
                    </DoubleConfirm>
                    <Tooltip title="Editar" placement="top">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        disabled={!entry.canBeEdited}
                        onClick={() => props.onEdit(entry.id)}
                      />
                    </Tooltip>
                    <Tooltip title="Visualizar" placement="right">
                      <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => props.onDetail(entry.id)}
                      />
                    </Tooltip>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            );
          },
        },
        {
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
          responsive: ['sm'],
          render(description: CashFlow.EntrySummary['description']) {
            return <Tooltip title={description}>{description}</Tooltip>;
          },
        },
        {
          dataIndex: 'category',
          title: 'Categoria',
          align: 'center',
          width: 120,
          responsive: ['sm'],
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          dataIndex: 'transactedOn',
          title: 'Data',
          align: 'center',
          width: 120,
          responsive: ['sm'],
          filterDropdown() {
            return (
              <Card>
                <DatePicker.MonthPicker
                  allowClear={false}
                  format={'YYYY - MMM'}
                  onChange={(date) =>
                    navigate({
                      search: `yearMonth=${
                        date?.format('YYYY-MM') || moment().format('YYYY-MM')
                      }`,
                    })
                  }
                />
              </Card>
            );
          },
          render(transactedOn: CashFlow.EntrySummary['transactedOn']) {
            return moment(transactedOn).format('DD/MM/YYYY');
          },
        },
        {
          dataIndex: 'amount',
          title: 'Valor',
          align: 'right',
          width: 120,
          responsive: ['sm'],
          render: formatToBrl,
        },
        {
          dataIndex: 'id',
          title: 'Ações',
          align: 'center',
          width: 120,
          responsive: ['sm'],
          render(id: number, entry: CashFlow.EntrySummary) {
            return (
              <Space>
                <DoubleConfirm
                  popConfirmTitle={
                    type === 'EXPENSE' ? 'Remover despesa?' : 'Remover receita?'
                  }
                  modalTitle={`Deseja mesmo remover esta ${
                    type === 'EXPENSE' ? 'despesa' : 'receita'
                  }?`}
                  modalContent={`Remover uma ${
                    type === 'EXPENSE' ? 'despesa' : 'receita'
                  } pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível`}
                  onConfirm={async () => {
                    await deleteEntry(id);
                    notification.success({
                      message: `${
                        type === 'EXPENSE' ? 'Despesa' : 'Receita'
                      } removida com sucesso`,
                    });
                  }}
                  disabled={!entry.canBeDeleted}
                >
                  <Tooltip title="Remover" placement="left">
                    <Button
                      type="text"
                      size="small"
                      loading={fetching}
                      icon={<DeleteOutlined />}
                      disabled={!entry.canBeDeleted}
                      danger
                    />
                  </Tooltip>
                </DoubleConfirm>
                <Tooltip title="Editar" placement="top">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    disabled={!entry.canBeEdited}
                    onClick={() => props.onEdit(id)}
                  />
                </Tooltip>
                <Tooltip title="Visualizar" placement="right">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => props.onDetail(id)}
                  />
                </Tooltip>
              </Space>
            );
          },
        },
      ]}
    />
  );
}
