import {
  Table,
  Tag,
  Space,
  Button,
  Tooltip,
  Card,
  DatePicker,
  notification,
} from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import formatToBrl from '../../core/utils/formatToBrl';
import DoubleConfirm from '../components/DoubleConfirm';
import { useHistory, useLocation } from 'react-router-dom';

interface EntriesListProps {
  type: 'EXPENSE' | 'REVENUE';
  onEdit: (entryId: number) => any;
  onDetail: (entryId: number) => any;
}

export default function EntriesList(props: EntriesListProps) {
  const { type } = props;

  const location = useLocation();
  const history = useHistory();

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

  useEffect(() => {
    fetchEntries();
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
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
          render(description: CashFlow.EntrySummary['description']) {
            return <Tooltip title={description}>{description}</Tooltip>;
          },
        },
        {
          dataIndex: 'category',
          title: 'Categoria',
          align: 'center',
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          dataIndex: 'transactedOn',
          title: 'Data',
          align: 'center',
          filterDropdown() {
            return (
              <Card>
                <DatePicker.MonthPicker
                  allowClear={false}
                  format={'YYYY - MMM'}
                  onChange={(date) =>
                    history.push({
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
          render: formatToBrl,
        },
        {
          dataIndex: 'id',
          title: 'Ações',
          align: 'center',
          render(id: number) {
            return (
              <Space>
                <Tooltip title="Remover" placement="left">
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
                      await deleteEntry(id);
                      notification.success({
                        message: `${
                          type === 'EXPENSE' ? 'Despesa' : 'Receita'
                        } removida com sucesso`,
                      });
                    }}
                  >
                    <Button
                      type="text"
                      size="small"
                      loading={fetching}
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </DoubleConfirm>
                </Tooltip>
                <Tooltip title="Visualizar" placement="top">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => props.onDetail(id)}
                  />
                </Tooltip>
                <Tooltip title="Editar" placement="right">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => props.onEdit(id)}
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
