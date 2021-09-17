import { Space, Typography, Tooltip, Divider, Row, Button, Modal } from 'antd';
import { InfoCircleFilled, TagOutlined } from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from '../features/EntryCategoryManager';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const { selected, fetching, removeEntriesInBatch } = useCashFlow('EXPENSE');

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);

  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  return (
    <>
      <Modal
        closeIcon={<></>}
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        footer={null}
      >
        <EntryCategoryManager type="EXPENSE" />
      </Modal>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <DoubleConfirm
          popConfirmTitle={`Remover ${
            selected.length > 1
              ? 'entradas selecionadas?'
              : 'entrada selecionada?'
          } `}
          modalTitle="Remover entradas"
          modalContent="Remover uma ou mais entradas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível."
          onConfirm={async () =>
            await removeEntriesInBatch(selected as number[])
          }
        >
          <Button type="default" loading={fetching} disabled={!selected.length}>
            Remover
          </Button>
        </DoubleConfirm>
        <Button
          type="default"
          icon={<TagOutlined />}
          onClick={openCategoryModal}
        >
          Categorias
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

      <EntriesList />
    </>
  );
}
