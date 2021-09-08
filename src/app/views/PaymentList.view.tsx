import {
  Button,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  DatePicker,
  Descriptions,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Payment } from 'rodolfohiok-sdk';
import usePayments from '../../core/hooks/usePayments';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { Key, SorterResult } from 'antd/lib/table/interface';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import DoubleConfirm from '../components/DoubleConfirm';
import { Link } from 'react-router-dom';

export default function PaymentListView() {
  const { payments, fetchPayments, fetchingPayments } = usePayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [yearMonth, setYearMonth] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [sortingOrder, setSortingOrder] = useState<
    'asc' | 'desc' | undefined
  >();
  const { xs } = useBreakpoint();

  useEffect(() => {
    fetchPayments({
      scheduledToYearMonth: yearMonth,
      page: page - 1,
      size: 5,
      sort: ['scheduledTo', sortingOrder || 'desc'],
    });
  }, [fetchPayments, yearMonth, page, sortingOrder]);

  return (
    <>
      <Row justify="space-between" gutter={24}>
        <div style={{ width: xs ? '100%' : 240, marginBottom: xs ? 8 : 0 }}>
          <DoubleConfirm
            popConfirmTitle={
              selectedRowKeys.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            disabled={selectedRowKeys.length === 0}
            modalTitle="Aprovar agendamento"
            modalContent="Esta ação é irreversível. Ao aprovar um agendamento, ele não poderá ser removido!"
            onConfirm={() => {
              console.log(
                'todo: implementar aprovação multiplas de agendamento'
              );
            }}
          >
            <Button
              block={true}
              type="primary"
              disabled={selectedRowKeys.length === 0}
            >
              Aprovar agendamentos
            </Button>
          </DoubleConfirm>
        </div>
        <div style={{ width: xs ? '100%' : 240 }}>
          <DatePicker.MonthPicker
            placeholder="filtrar por mês"
            style={{ width: '100%' }}
            format="MMMM - YYYY"
            onChange={(date) => {
              setYearMonth(date ? date.format('YYYY-MM') : undefined);
            }}
          />
        </div>
      </Row>
      <Table<Payment.Summary>
        loading={fetchingPayments}
        dataSource={payments?.content}
        rowKey="id"
        onChange={(p, f, sorter) => {
          const { order } = sorter as SorterResult<Payment.Summary>;
          order === 'ascend' ? setSortingOrder('asc') : setSortingOrder('desc');
        }}
        pagination={{
          current: page,
          onChange: setPage,
          total: payments?.totalElements,
          pageSize: 5,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps(payment) {
            return !payment.canBeApproved ? { disabled: true } : {};
          },
        }}
        columns={[
          {
            title: 'Agendamentos',
            responsive: ['xs'],
            render(payment: Payment.Summary) {
              const starts = moment(payment.accountingPeriod.startsOn).format(
                'DD/MM/YYYY'
              );
              const ends = moment(payment.accountingPeriod.endsOn).format(
                'DD/MM/YYYY'
              );
              const formattedApprovalDate = moment(payment.approvedAt).format(
                'DD/MM/YYYY'
              );
              return (
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Editor">
                    <Link to={`/usuarios/${payment.payee.id}`}>
                      {payment.payee.name}
                    </Link>
                  </Descriptions.Item>
                  <Descriptions.Item label="Agendamento">
                    {moment(payment.scheduledTo).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Período">
                    {`${starts} - ${ends}`}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={payment.approvedAt ? 'green' : 'warning'}>
                      {payment.approvedAt
                        ? `Aprovado em ${formattedApprovalDate}`
                        : 'Aguardando aprovação'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ações">
                    <Space>
                      <Tooltip title="Detalhar" placement="left">
                        <Button size="small" icon={<EyeOutlined />} />
                      </Tooltip>
                      <Popconfirm
                        title="Remover agendamento?"
                        disabled={!payment.canBeDeleted}
                        onConfirm={() =>
                          confirm({
                            title: 'Remover agendamento?',
                            cancelText: 'Cancelar',
                            content:
                              'Esta ação é irreversível. Ao remover um agendamento, ele não poderá ser recuperado!',
                            onOk() {
                              console.log(
                                'todo: implementar deleção de agendamento'
                              );
                            },
                          })
                        }
                      >
                        <Tooltip
                          title={
                            payment.canBeDeleted
                              ? 'Remover'
                              : 'Agendamento já aprovado'
                          }
                          placement="right"
                        >
                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            disabled={!payment.canBeDeleted}
                          />
                        </Tooltip>
                      </Popconfirm>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'payee',
            title: 'Editor',
            responsive: ['sm'],
            width: 180,
            ellipsis: true,
            render(payee: Payment.Summary['payee']) {
              return <Link to={`/usuarios/${payee.id}`}>{payee.name}</Link>;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            align: 'center',
            responsive: ['sm'],
            width: 120,
            sorter(a, b) {
              return 0;
            },
            render(date: string) {
              return moment(date).format('DD/MM/YYYY');
            },
          },
          {
            dataIndex: 'accountingPeriod',
            title: 'Período',
            align: 'center',
            responsive: ['sm'],
            width: 240,
            render(period: Payment.Summary['accountingPeriod']) {
              const starts = moment(period.startsOn).format('DD/MM/YYYY');
              const ends = moment(period.endsOn).format('DD/MM/YYYY');
              return `${starts} - ${ends}`;
            },
          },
          {
            dataIndex: 'approvedAt',
            title: 'Status',
            align: 'center',
            responsive: ['sm'],
            width: 180,
            render(approvalDate: Payment.Summary['approvedAt']) {
              const formattedApprovalDate =
                moment(approvalDate).format('DD/MM/YYYY');
              return (
                <Tag color={approvalDate ? 'green' : 'warning'}>
                  {approvalDate
                    ? `Aprovado em ${formattedApprovalDate}`
                    : 'Aguardando aprovação'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            responsive: ['sm'],
            width: 100,
            render(id: number, payment: Payment.Summary) {
              return (
                <Space>
                  <Tooltip title="Detalhar" placement="left">
                    <Button size="small" icon={<EyeOutlined />} />
                  </Tooltip>
                  <Popconfirm
                    title="Remover agendamento?"
                    disabled={!payment.canBeDeleted}
                    onConfirm={() =>
                      confirm({
                        title: 'Remover agendamento?',
                        cancelText: 'Cancelar',
                        content:
                          'Esta ação é irreversível. Ao remover um agendamento, ele não poderá ser recuperado!',
                        onOk() {
                          console.log(
                            'todo: implementar deleção de agendamento'
                          );
                        },
                      })
                    }
                  >
                    <Tooltip
                      title={
                        payment.canBeDeleted
                          ? 'Remover'
                          : 'Agendamento já aprovado'
                      }
                      placement="right"
                    >
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        disabled={!payment.canBeDeleted}
                      />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}
