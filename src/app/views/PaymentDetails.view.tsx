import {
  Card,
  Descriptions,
  Divider,
  Space,
  Tag,
  Typography,
  Table,
} from 'antd';
import { Post } from 'rodolfohiok-sdk';

export default function PaymentDetailsView() {
  return (
    <>
      <Card>
        <Typography.Title>Pagamento</Typography.Title>
        <Typography.Text>
          A base do pagamento é calculada pela quantidade de palavras escritas
        </Typography.Text>
        <Divider />
        <Descriptions column={2}>
          <Descriptions.Item label="Editor">
            {'nome do editor'}
          </Descriptions.Item>
          <Descriptions.Item label="Período">
            <Space size={8}>
              <Tag style={{ margin: 0 }}>{'01/01/2021'}</Tag>
              <span>até</span>
              <Tag>{'02/02/2021'}</Tag>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Ganhos por posts">
            <Tag>{'R$ 12.345,67'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            <Tag>{'R$ 123.456,78'}</Tag>
          </Descriptions.Item>
        </Descriptions>
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
