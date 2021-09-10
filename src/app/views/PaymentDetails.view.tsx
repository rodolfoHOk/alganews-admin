import { Card, Divider } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import usePayment from '../../core/hooks/usePayment';
import PaymentHeader from '../features/PaymentHeader';
import PaymentBonuses from '../features/PaymentBonuses';
import PaymentPosts from '../features/PaymentPosts';
import moment from 'moment';

export default function PaymentDetailsView() {
  const params = useParams<{ id: string }>();
  const {
    payment,
    fetchPayment,
    posts,
    fetchPosts,
    fetchingPayment,
    fetchingPosts,
  } = usePayment();

  useEffect(() => {
    fetchPayment(Number(params.id));
    fetchPosts(Number(params.id));
  }, [fetchPayment, fetchPosts, params.id]);

  return (
    <>
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
