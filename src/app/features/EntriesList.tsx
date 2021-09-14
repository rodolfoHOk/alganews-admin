import { Table, Tag, Space, Button, Tooltip, Card, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useCashFlow from '../../core/hooks/useCashFlow';
import formatToBrl from '../../core/utils/formatToBrl';

export default function EntriesList() {
  const { entries, fetchEntries, fetchingEntries, query, setQuery } =
    useCashFlow('EXPENSE');

  useEffect(() => {
    fetchEntries();
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
                    setQuery({
                      ...query,
                      yearMonth:
                        date?.format('YYYY-MM') || moment().format('YYYY-MM'),
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
