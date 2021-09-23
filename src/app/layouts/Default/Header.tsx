import { Avatar, Layout, Row, Dropdown, Menu, Card, Tag } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../../assets/logo.svg';
import useAuth from '../../../core/hooks/useAuth';

const { Header } = Layout;

export default function DefaultLayoutHeader() {
  const { user } = useAuth();

  return (
    <Header className="header no-print">
      <div className="logo" />
      <Row
        justify="space-between"
        align="middle"
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
      >
        <img src={logo} alt="AlgaNews Admin" />
        <Dropdown
          placement="bottomRight"
          overlay={
            <Card style={{ width: 220 }}>
              <Card bordered={false}>
                <Meta
                  // avatar={<Avatar src={user?.avatarUrls.small} />}
                  title={user?.name}
                  description={
                    <Tag color={user?.role === 'MANAGER' ? 'red' : 'blue'}>
                      {user?.role === 'MANAGER'
                        ? 'Gerente'
                        : user?.role === 'ASSISTANT'
                        ? 'Assistente'
                        : 'Editor'}
                    </Tag>
                  }
                />
              </Card>
              <Menu>
                <Menu.Item icon={<UserOutlined />}>Meu Perfil</Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} danger>
                  Fazer Logout
                </Menu.Item>
              </Menu>
            </Card>
          }
        >
          <Avatar src={user?.avatarUrls.small} />
        </Dropdown>
      </Row>
    </Header>
  );
}
