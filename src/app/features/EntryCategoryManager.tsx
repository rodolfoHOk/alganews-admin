import { Button, Row, Table } from 'antd';
import { CashFlow } from 'rodolfohiok-sdk';

export default function EntryCategoryManager() {
  return (
    <>
      <Row justify="space-between">
        <Button type="primary">Atualizar categorias</Button>
        <Button type="primary">Adicionar categoria</Button>
      </Row>
      <Table<CashFlow.CategorySummary>
        dataSource={[]}
        rowKey="id"
        columns={[]}
      />
    </>
  );
}
