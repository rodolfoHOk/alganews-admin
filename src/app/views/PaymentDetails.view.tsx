import { Card, Descriptions, Divider, Typography, Table } from 'antd';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Post } from 'rodolfohiok-sdk';
import usePayment from '../../core/hooks/usePayment';
import PaymentHeader from '../features/PaymentHeader';
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
        <Typography.Title level={2}>Bônus</Typography.Title>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="1 milhão de views em 1 dia">
            {'R$ 12.345,67'}
          </Descriptions.Item>
          <Descriptions.Item label="20 milhão de views em 1 dia">
            {'R$ 12.345,67'}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Table<Post.WithEarnings>
          dataSource={[]}
          columns={[
            {
              dataIndex: 'title',
              title: 'Post',
              ellipsis: true,
            },
            {
              dataIndex: 'earnings.pricePerWord',
              title: 'Preço por palavra',
            },
            {
              dataIndex: 'earnings.words',
              title: 'Palavras no post',
            },
            {
              dataIndex: 'earnings.totalAmount',
              title: 'Total ganho neste post',
            },
          ]}
        />
      </Card>
    </>
  );
}
