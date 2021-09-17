import { Button, Form, Input, Row, Table, Tooltip, Modal, Col } from 'antd';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import useEntriesCategories from '../../core/hooks/useEntriesCategories';

export default function EntryCategoryManager(props: {
  type: 'EXPENSE' | 'REVENUE';
}) {
  const { expenses, revenues, fetchCategories, fetching } =
    useEntriesCategories();

  const [showCreationModal, setShowCreationModal] = useState(false);

  const openCreationModal = useCallback(() => setShowCreationModal(true), []);
  const closeCreationModal = useCallback(() => setShowCreationModal(false), []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Modal
        title="Adicionar categoria"
        visible={showCreationModal}
        onCancel={closeCreationModal}
        footer={null}
      >
        <CategoryForm />
      </Modal>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Button type="default">Atualizar categorias</Button>
        <Button type="default" onClick={openCreationModal}>
          Adicionar categoria
        </Button>
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

function CategoryForm() {
  return (
    <Form layout="vertical">
      <Row justify="end">
        <Col xs={24}>
          <Form.Item
            label="Categoria"
            name="name"
            rules={[
              { required: true, message: 'O nome da categoria é obrigatório' },
            ]}
          >
            <Input placeholder="E.g.: Infra" />
          </Form.Item>
        </Col>
        <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
          Cadastrar categoria
        </Button>
      </Row>
    </Form>
  );
}
