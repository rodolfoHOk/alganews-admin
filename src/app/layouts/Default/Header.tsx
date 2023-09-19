import { Avatar, Layout, Row, Dropdown, Card, Tag, Button } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import useAuth from '../../../core/hooks/useAuth';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';
import AuthorizationService from '../../../auth/Authorization.service';
import { LogoSVG } from '../../components/LogoSVG';
import { MenuProps } from 'antd/lib';

const { Header } = Layout;

export default function DefaultLayoutHeader() {
  const { user } = useAuth();

  const dropdownItems: MenuProps['items'] = [
    {
      key: 1,
      label: (
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
      ),
    },
    {
      key: 2,
      label: (
        <Button icon={<UserOutlined />} style={{ width: '100%' }} type="text">
          <Link to={`/usuarios/${user?.id}`}>Meu Perfil</Link>{' '}
        </Button>
      ),
    },
    {
      key: 3,
      label: (
        <Button
          type="default"
          icon={<LogoutOutlined />}
          style={{ width: '100%' }}
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
        </Button>
      ),
    },
  ];

  return (
    <Header className="header no-print" style={{ backgroundColor: '#f3f8fa' }}>
      <div className="logo" />
      <Row
        justify="space-between"
        align="middle"
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
      >
        <LogoSVG />
        <Dropdown placement="bottomRight" menu={{ items: dropdownItems }}>
          <Avatar src={user?.avatarUrls.small} />
        </Dropdown>
      </Row>
    </Header>
  );
}
