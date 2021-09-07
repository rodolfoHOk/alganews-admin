import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { Payment } from 'rodolfohiok-sdk';
import usePayments from '../../core/hooks/usePayments';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';

export default function PaymentListView() {
  const { payments, fetchPayments, fetching } = usePayments();

  useEffect(() => {
    fetchPayments({
      page: 0,
      sort: ['scheduledTo', 'desc'],
    });
  }, [fetchPayments]);

  return (
    <>
      <Table<Payment.Summary>
        loading={fetching}
        dataSource={payments?.content}
        rowKey="id"
        columns={[
          {
            dataIndex: 'id',
            title: '#',
          },
          {
            dataIndex: 'payee',
            title: 'Editor',
            render(payee: Payment.Summary['payee']) {
              return payee.name;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            align: 'center',
            render(date: string) {
              return moment(date).format('DD/MM/YYYY');
            },
          },
          {
            dataIndex: 'accountingPeriod',
            title: 'Periodo',
            align: 'center',
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
            render(id: number, payment: Payment.Summary) {
              return (
                <Space>
                  <Tooltip title="Detalhar" placement="left">
                    <Button size="small" icon={<EyeOutlined />} />
                  </Tooltip>
                  <Popconfirm
                    title="Remover agendamento?"
                    onConfirm={() =>
                      confirm({
                        title: 'Remover agendamento?',
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
                          : 'Pagamento já aprovado'
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
