import {
  Button,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Payment } from 'rodolfohiok-sdk';
import usePayments from '../../core/hooks/usePayments';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { Key } from 'antd/lib/table/interface';

export default function PaymentListView() {
  const { payments, fetchPayments, fetching } = usePayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [yearMonth, setYearMonth] = useState<string | undefined>();

  useEffect(() => {
    fetchPayments({
      page: 0,
      scheduledToYearMonth: yearMonth,
    });
  }, [fetchPayments, yearMonth]);

  return (
    <>
      <Row justify="space-between">
        <Popconfirm
          title={
            selectedRowKeys.length === 1
              ? 'Você deseja aprovar o pagamento selecionado?'
              : 'Você deseja aprovar os pagamentos selecionados?'
          }
          onConfirm={() =>
            confirm({
              title: 'Aprovar pagamento',
              content:
                'Esta é um ação irreversível. Ao aprovar um pagamento, ele não poderá ser removido',
              onOk() {
                console.log(
                  'todo: implementar a aprovação de vários pagamentos'
                );
              },
            })
          }
        >
          <Button type="primary" disabled={setSelectedRowKeys.length === 0}>
            Aprovar pagamentos
          </Button>
        </Popconfirm>
        <DatePicker.MonthPicker
          style={{ width: 240 }}
          format="MMMM - YYYY"
          onChange={(date) => {
            setYearMonth(date ? date.format('YYYY-MM') : undefined);
          }}
        />
      </Row>
      <Table<Payment.Summary>
        loading={fetching}
        dataSource={payments?.content}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps(payment) {
            return !payment.canBeApproved ? { disabled: true } : {};
          },
        }}
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
