import {
  Space,
  Typography,
  Tooltip,
  Divider,
  Row,
  Button,
  Modal,
  notification,
} from 'antd';
import {
  InfoCircleFilled,
  TagOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from '../features/EntryCategoryManager';
import EntryForm from '../features/EntryForm';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const { selected, fetching, removeEntriesInBatch } = useCashFlow('EXPENSE');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | undefined>(
    undefined
  );

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);
  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  return (
    <>
      <Modal
        title="Gerenciar categorias"
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        footer={null}
        destroyOnClose
      >
        <EntryCategoryManager type="EXPENSE" />
      </Modal>
      <Modal
        title="Cadastrar despesa"
        visible={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        destroyOnClose
      >
        <EntryForm
          type="EXPENSE"
          editingEntry={editingEntry}
          onSuccess={() => {
            closeFormModal();
            notification.success({
              message: editingEntry
                ? 'Despesa atualizada com sucesso'
                : 'Despesa cadastrada com sucesso',
            });
            setEditingEntry(undefined);
          }}
        />
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
          <Button type="primary" loading={fetching} disabled={!selected.length}>
            Remover
          </Button>
        </DoubleConfirm>
        <Space>
          <Button
            type="primary"
            icon={<TagOutlined />}
            onClick={openCategoryModal}
          >
            Categorias
          </Button>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={openFormModal}
          >
            Adicionar despesa
          </Button>
        </Space>
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

      <EntriesList
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
      />
    </>
  );
}
