import { Table, Tooltip } from 'antd';
import { Post } from 'rodolfohiok-sdk';

interface PaymentPostsProps {
  posts: Post.WithEarnings[];
}

export default function PaymentPosts(props: PaymentPostsProps) {
  return (
    <>
      <Table<Post.WithEarnings>
        dataSource={props.posts}
        rowKey={'id'}
        pagination={false}
        columns={[
          {
            dataIndex: 'title',
            title: 'Post',
            width: 300,
            ellipsis: true,
            render(title) {
              return <Tooltip title={title}>{title}</Tooltip>;
            },
          },
          {
            dataIndex: ['earnings', 'pricePerWord'],
            title: 'Preço por palavra',
            width: 150,
            align: 'right',
            render(pricePerWord: number) {
              return pricePerWord.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              });
            },
          },
          {
            dataIndex: 'earnings.words'.split('.'),
            title: 'Palavras no post',
            width: 150,
            align: 'right',
          },
          {
            dataIndex: 'earnings.totalAmount'.split('.'),
            title: 'Total ganho neste post',
            width: 170,
            align: 'right',
            render(totalAmount: number) {
              return totalAmount.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL',
              });
            },
          },
        ]}
      />
    </>
  );
}
