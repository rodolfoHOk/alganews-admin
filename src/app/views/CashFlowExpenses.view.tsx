import { Space, Typography, Tooltip, Divider } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  return (
    <>
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

      <EntriesList />
    </>
  );
}
