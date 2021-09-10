import { Descriptions, Table, Tooltip } from 'antd';
import { Post } from 'rodolfohiok-sdk';

interface PaymentPostsProps {
  posts: Post.WithEarnings[];
  loading?: boolean;
}

export default function PaymentPosts(props: PaymentPostsProps) {
  return (
    <>
      <Table<Post.WithEarnings>
        loading={props.loading}
        dataSource={props.posts}
        rowKey={'id'}
        pagination={false}
        columns={[
          {
            responsive: ['xs'],
            title: 'Posts',
            render(post: Post.WithEarnings) {
              return (
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Título">
                    {post.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Preço por palavra">
                    {post.earnings.pricePerWord.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label="Palavras no post">
                    {post.earnings.words}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total ganho neste post">
                    {post.earnings.totalAmount.toLocaleString('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 2,
                    })}
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'title',
            title: 'Post',
            responsive: ['sm'],
            width: 300,
            ellipsis: true,
            render(title) {
              return <Tooltip title={title}>{title}</Tooltip>;
            },
          },
          {
            dataIndex: ['earnings', 'pricePerWord'],
            title: 'Preço por palavra',
            responsive: ['sm'],
            width: 150,
            align: 'right',
            render(pricePerWord: number) {
              return pricePerWord.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 2,
              });
            },
          },
          {
            dataIndex: 'earnings.words'.split('.'),
            title: 'Palavras no post',
            responsive: ['sm'],
            width: 150,
            align: 'right',
          },
          {
            dataIndex: 'earnings.totalAmount'.split('.'),
            title: 'Total ganho neste post',
            responsive: ['sm'],
            width: 170,
            align: 'right',
            render(totalAmount: number) {
              return totalAmount.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 2,
              });
            },
          },
        ]}
      />
    </>
  );
}
