import { Space, Typography, Tooltip, Divider, Row, Button } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const { selected, setSelected } = useCashFlow('EXPENSE');

  return (
    <>
      <Row>
        <Button type="primary" disabled={!selected.length}>
          Remover
        </Button>
      </Row>
      <Space direction="vertical">
        <Title level={3}>Recuperando entradas do mês de agosto</Title>
        <Space>
          <Text>É possivel filtrar lançamentos por mês</Text>
          <Tooltip title="Use a coluna data para filtrar" placement="right">
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>
      <Divider />

      <EntriesList selected={selected} onSelect={setSelected} />
    </>
  );
}
