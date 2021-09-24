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
  notification,
} from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { Payment } from 'rodolfohiok-sdk';
import usePayments from '../../core/hooks/usePayments';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { SorterResult } from 'antd/lib/table/interface';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import DoubleConfirm from '../components/DoubleConfirm';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Forbidden from '../components/Forbidden';
import usePageTitle from '../../core/hooks/usePageTitle';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentListView() {
  usePageTitle('Consulta de pagamentos');
  useBreadcrumb('Pagamentos/Consulta');

  const { xs } = useBreakpoint();
  const {
    payments,
    fetching,
    query,
    selected,
    fetchPayments,
    approvePaymentsInBatch,
    setQuery,
    setSelected,
    removePayment,
  } = usePayments();

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchPayments().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchPayments]);

  if (forbidden) return <Forbidden />;

  return (
    <>
      <Row justify="space-between" gutter={24}>
        <div style={{ width: xs ? '100%' : 240, marginBottom: xs ? 8 : 0 }}>
          <DoubleConfirm
            popConfirmTitle={
              selected.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            disabled={selected.length === 0}
            modalTitle="Aprovar agendamento"
            modalContent="Esta ação é irreversível. Ao aprovar um agendamento, ele não poderá ser removido!"
            onConfirm={async () => {
              await approvePaymentsInBatch(selected as number[]);
              notification.success({
                message: 'Os pagamentos selecionados foram aprovados',
              });
            }}
          >
            <Button
              block={true}
              type="primary"
              disabled={selected.length === 0}
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
              setQuery({
                scheduledToYearMonth: date ? date.format('YYYY-MM') : undefined,
              });
            }}
          />
        </div>
      </Row>
      <Table<Payment.Summary>
        loading={fetching}
        dataSource={payments?.content}
        rowKey="id"
        onChange={(p, f, sorter) => {
          const { order } = sorter as SorterResult<Payment.Summary>;
          const direction = order?.replace('end', '');
          if (direction && direction !== query.sort![1])
            setQuery({
              sort: [query.sort![0], (direction as 'asc') || 'desc'],
            });
        }}
        pagination={{
          current: query.page ? query.page + 1 : 1,
          onChange: (page) =>
            setQuery({
              page: page - 1,
            }),
          total: payments?.totalElements,
          pageSize: query.size,
        }}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: setSelected,
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
                        <Link to={`/pagamentos/${payment.id}`}>
                          <Button size="small" icon={<EyeOutlined />} />
                        </Link>
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
                            onOk: async () => {
                              await removePayment(payment.id);
                              notification.success({
                                message: 'Agendamento foi removido',
                              });
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
                    <Link to={`/pagamentos/${id}`}>
                      <Button size="small" icon={<EyeOutlined />} />
                    </Link>
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
                        onOk: async () => {
                          await removePayment(id);
                          notification.success({
                            message: 'Agendamento foi removido',
                          });
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
