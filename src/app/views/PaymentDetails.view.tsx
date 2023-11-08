import { Card, Divider, Button, Tag, Space, notification } from 'antd';
import { PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import usePayment from '../../core/hooks/usePayment';
import PaymentHeader from '../features/PaymentHeader';
import PaymentBonuses from '../features/PaymentBonuses';
import PaymentPosts from '../features/PaymentPosts';
import moment from 'moment';
import NotFoundError from '../components/NotFoundError';
import usePageTitle from '../../core/hooks/usePageTitle';
import DoubleConfirm from '../components/DoubleConfirm';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';

export default function PaymentDetailsView() {
  usePageTitle('Detalhes do pagamento');
  useBreadcrumb('Pagamento/Detalhes');

  const params = useParams<{ id: string }>();
  const {
    payment,
    fetchPayment,
    posts,
    fetchPosts,
    fetchingPayment,
    fetchingPosts,
    paymentNotFound,
    approvingPayment,
    approvePayment,
  } = usePayment();

  useEffect(() => {
    fetchPayment(Number(params.id));
    fetchPosts(Number(params.id));
  }, [fetchPayment, fetchPosts, params.id]);

  if (isNaN(Number(params.id))) return <Navigate to="/pagamentos" />;

  if (paymentNotFound) {
    return (
      <NotFoundError
        title="Pagamento não encontrado"
        actionTitle="Ir para a lista de pagamentos"
        actionDestination="/pagamentos"
      />
    );
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          className="no-print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={window.print}
        >
          Imprimir
        </Button>
        {payment?.approvedAt ? (
          <Tag>{`Pagamento aprovado em ${moment(payment?.approvedAt).format(
            'DD/MM/YYYY'
          )}`}</Tag>
        ) : (
          <DoubleConfirm
            disabled={!payment || !payment.canBeApproved}
            popConfirmTitle="Deseja aprovar este agendamento?"
            modalTitle="Ação irreversível"
            modalContent="Aprovar um agendamento de pagamento gera uma despesa que não pode ser removida do fluxo de caixa. Essa ação não poderá ser desfeita."
            onConfirm={async () => {
              if (payment) {
                await approvePayment(payment.id);
                fetchPayment(payment.id);
                notification.success({
                  message: 'Pagamento aprovado com sucesso',
                });
              }
            }}
          >
            <Button
              loading={approvingPayment}
              disabled={!payment || !payment.canBeApproved}
              className="no-print"
              type="primary"
              danger
              icon={<CheckCircleOutlined />}
            >
              Aprovar agendamento
            </Button>
          </DoubleConfirm>
        )}
      </Space>
      <Card>
        <PaymentHeader
          loading={fetchingPayment}
          editorId={payment?.payee.id}
          editorName={payment?.payee.name}
          periodStart={moment(payment?.accountingPeriod.startsOn).format(
            'DD/MM/YYYY'
          )}
          periodEnd={moment(payment?.accountingPeriod.endsOn).format(
            'DD/MM/YYYY'
          )}
          postsEarnings={payment?.earnings.totalAmount}
          totalEarnings={payment?.grandTotalAmount}
        />
        <Divider />
        <PaymentBonuses loading={fetchingPayment} bonuses={payment?.bonuses} />
        <Divider />
        <PaymentPosts loading={fetchingPosts} posts={posts} />
      </Card>
    </>
  );
}
