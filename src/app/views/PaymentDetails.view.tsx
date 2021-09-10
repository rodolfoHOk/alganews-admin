import { Card, Divider, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import usePayment from '../../core/hooks/usePayment';
import PaymentHeader from '../features/PaymentHeader';
import PaymentBonuses from '../features/PaymentBonuses';
import PaymentPosts from '../features/PaymentPosts';
import moment from 'moment';
import NotFoundError from '../components/NotFoundError';
import usePageTitle from '../../core/hooks/usePageTitle';

export default function PaymentDetailsView() {
  usePageTitle('Detalhes do pagamento');

  const params = useParams<{ id: string }>();
  const {
    payment,
    fetchPayment,
    posts,
    fetchPosts,
    fetchingPayment,
    fetchingPosts,
    paymentNotFound,
  } = usePayment();

  useEffect(() => {
    fetchPayment(Number(params.id));
    fetchPosts(Number(params.id));
  }, [fetchPayment, fetchPosts, params.id]);

  if (isNaN(Number(params.id))) return <Redirect to="/pagamentos" />;

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
      <Button
        className="no-print"
        type="primary"
        style={{ marginBottom: 16 }}
        icon={<PrinterOutlined />}
        onClick={window.print}
      >
        Imprimir
      </Button>
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
