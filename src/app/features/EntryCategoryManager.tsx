import { Button, Row, Table, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';

export default function EntryCategoryManager(props: {
  type: 'EXPENSE' | 'REVENUE';
}) {
  const { expenses, revenues, fetchCategories, fetching } =
    useEntriesCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Button type="primary">Atualizar categorias</Button>
        <Button type="primary">Adicionar categoria</Button>
      </Row>
      <Table<CashFlow.CategorySummary>
        size="small"
        dataSource={props.type === 'EXPENSE' ? expenses : revenues}
        loading={fetching}
        rowKey="id"
        columns={[
          {
            dataIndex: 'name',
            title: 'Descrição',
          },
          {
            dataIndex: 'totalEntries',
            title: 'Vínculos',
            align: 'right',
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'right',
            render(id: number) {
              return (
                <Tooltip title="Remover">
                  <Button
                    type="ghost"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Tooltip>
              );
            },
          },
        ]}
      />
    </>
  );
}
