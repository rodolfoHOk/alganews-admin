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
import EntriesList from './EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from './EntryCategoryManager';
import EntryForm from './EntryForm';
import EntryDetails from './EntryDetails';
import moment from 'moment';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Title, Text } = Typography;

interface EntryCRUDProps {
  type: 'EXPENSE' | 'REVENUE';
}

export default function EntryCRUD({ type }: EntryCRUDProps) {
  const { xs } = useBreakpoint();

  const { selected, fetching, removeEntriesInBatch, query } = useCashFlow(type);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | undefined>(
    undefined
  );
  const [detailedEntry, setDetailedEntry] = useState<number | undefined>(
    undefined
  );

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);
  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);
  const openDetailsModal = useCallback(() => setShowDetailsModal(true), []);
  const closeDetailsModal = useCallback(() => setShowDetailsModal(false), []);

  return (
    <>
      <Modal
        title="Gerenciar categorias"
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        footer={null}
        destroyOnClose
      >
        <EntryCategoryManager type={type} />
      </Modal>

      <Modal
        title={`${editingEntry ? 'Atualizar' : 'Cadastrar'} ${
          type === 'EXPENSE' ? 'despesa' : 'receita'
        }`}
        visible={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        destroyOnClose
      >
        <EntryForm
          type={type}
          editingEntry={editingEntry}
          onSuccess={() => {
            closeFormModal();
            notification.success({
              message: editingEntry
                ? type === 'EXPENSE'
                  ? 'Despesa atualizada com sucesso'
                  : 'Receita atualizada com sucesso'
                : type === 'EXPENSE'
                ? 'Despesa cadastrada com sucesso'
                : 'Receita cadastrada com sucesso',
            });
            setEditingEntry(undefined);
          }}
          onCancel={() => {
            closeFormModal();
            setEditingEntry(undefined);
          }}
        />
      </Modal>

      <Modal
        title={`Detalhes da ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
        visible={showDetailsModal}
        onCancel={closeDetailsModal}
        footer={null}
        destroyOnClose
      >
        {detailedEntry && <EntryDetails entryId={detailedEntry} />}
      </Modal>

      <Row
        justify="space-between"
        style={
          xs
            ? { marginBottom: 16, flexDirection: 'column-reverse' }
            : { marginBottom: 16 }
        }
      >
        <DoubleConfirm
          popConfirmTitle={
            selected.length > 1
              ? type === 'EXPENSE'
                ? 'Remover despesas selecionadas?'
                : 'Remover receitas selecionadas?'
              : type === 'EXPENSE'
              ? 'Remover despesa selecionada?'
              : 'Remover receita selecionada?'
          }
          modalTitle={
            type === 'EXPENSE' ? 'Remover despesas?' : 'Remover receitas?'
          }
          modalContent={
            type === 'EXPENSE'
              ? 'Remover uma ou mais despesas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.'
              : 'Remover uma ou mais receitas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.'
          }
          onConfirm={async () =>
            await removeEntriesInBatch(selected as number[])
          }
          disabled={!selected.length}
        >
          <Button
            type="primary"
            style={xs ? { marginTop: 16, width: 100 } : { width: 100 }}
            loading={fetching}
            disabled={!selected.length}
            danger={xs ? true : false}
          >
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
            {`Adicionar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
          </Button>
        </Space>
      </Row>
      <Space direction="vertical">
        <Title level={3}>
          {`Recuperando ${
            type === 'EXPENSE' ? 'despesas' : 'receitas'
          } do mês de ${moment(query.yearMonth).format('MMMM \\d\\e YYYY')}`}
        </Title>
        <Space>
          <Text>
            {`É possivel filtrar ${
              type === 'EXPENSE' ? 'despesas' : 'receitas'
            } por mês`}
          </Text>
          <Tooltip title="Use a coluna data para filtrar" placement="right">
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>
      <Divider />

      <EntriesList
        type={type}
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onDetail={(id) => {
          setDetailedEntry(id);
          openDetailsModal();
        }}
      />
    </>
  );
}
