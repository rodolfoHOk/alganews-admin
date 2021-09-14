import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import formatToBrl from '../../core/utils/formatToBrl';

export default function EntriesList() {
  const { entries, fetchEntries, fetchingEntries } = useCashFlow();

  useEffect(() => {
    fetchEntries({
      type: 'EXPENSE',
      sort: ['transactedOn', 'desc'],
      yearMonth: moment().format('YYYY-MM'),
    });
  }, [fetchEntries]);
  return (
    <Table<CashFlow.EntrySummary>
      loading={fetchingEntries}
      dataSource={entries}
      columns={[
        {
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
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
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Tooltip>
                <Tooltip title="Visualizar" placement="top">
                  <Button type="text" size="small" icon={<EyeOutlined />} />
                </Tooltip>
                <Tooltip title="Editar" placement="right">
                  <Button type="text" size="small" icon={<EditOutlined />} />
                </Tooltip>
              </Space>
            );
          },
        },
      ]}
    />
  );
}
