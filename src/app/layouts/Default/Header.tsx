import { Avatar, Layout, Row, Dropdown, Menu, Card, Tag } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../../assets/logo.svg';
import useAuth from '../../../core/hooks/useAuth';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';
import AuthorizationService from '../../../auth/Authorization.service';

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
            <Menu style={{ width: 220 }}>
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
              <Menu.Item icon={<UserOutlined />}>
                <Link to={`/usuarios/${user?.id}`}>Meu Perfil</Link>
              </Menu.Item>
              <Menu.Item
                icon={<LogoutOutlined />}
                onClick={() => {
                  confirm({
                    closable: true,
                    title: 'Fazer Logout',
                    content:
                      'Deseja realmente fazer o logout? Será necessário inserir as credenciais novamente.',
                    onOk() {
                      AuthorizationService.imperativelySendToLogout();
                    },
                    okButtonProps: { danger: true },
                    okText: 'Fazer logout',
                    cancelText: 'Permanecer logado',
                  });
                }}
                danger
              >
                Fazer Logout
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar src={user?.avatarUrls.small} />
        </Dropdown>
      </Row>
    </Header>
  );
}
