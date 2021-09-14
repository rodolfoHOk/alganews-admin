import { Space, Typography, Tooltip, Divider, Row, Button } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const {
    selected,
    setSelected,
    deleteEntriesInBatch,
    deletingEntriesInBatch,
  } = useCashFlow('EXPENSE');

  return (
    <>
      <Row>
        <DoubleConfirm
          popConfirmTitle={`Remover ${
            selected.length > 1
              ? 'entradas selecionadas?'
              : 'entrada selecionada?'
          } `}
          modalTitle="Remover entradas"
          modalContent="Remover uma ou mais entradas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível."
          onConfirm={async () =>
            await deleteEntriesInBatch(selected as number[])
          }
        >
          <Button
            type="primary"
            loading={deletingEntriesInBatch}
            disabled={!selected.length}
          >
            Remover
          </Button>
        </DoubleConfirm>
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
