import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Drawer, DrawerProps, Layout, Menu } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  HomeOutlined,
  TableOutlined,
  PlusCircleOutlined,
  DiffOutlined,
  FallOutlined,
  RiseOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Attributes, useMemo, useState } from 'react';
import { SiderProps } from 'antd/lib/layout';
import { LogoSVG } from '../../components/LogoSVG';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function DefaultLayoutSideBar() {
  const { lg } = useBreakpoint();

  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);

  const SidebarWrapper: React.FC = useMemo(() => (lg ? Sider : Drawer), [lg]);

  const siderProps = useMemo((): SiderProps => {
    return {
      width: 200,
      className: 'site-layout-background no-print',
    };
  }, []);

  const drawerProps = useMemo((): DrawerProps => {
    return {
      visible: show,
      closable: true,
      title: (
        <>
          <LogoSVG />
        </>
      ),
      headerStyle: { height: 64 },
      bodyStyle: { padding: 0 },
      onClose() {
        setShow(false);
      },
      placement: 'left',
    };
  }, [show]);

  const sidebarProps = useMemo(() => {
    return lg ? siderProps : drawerProps;
  }, [lg, drawerProps, siderProps]);

  return (
    <>
      {!lg && (
        <Button
          icon={<MenuOutlined />}
          type="text"
          style={{ position: 'fixed', top: 0, left: 0, height: 64, zIndex: 99 }}
          onClick={() => setShow(true)}
        />
      )}
      <SidebarWrapper {...(sidebarProps as Attributes)}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item
            key="/"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            <Link to={'/'}>Home</Link>
          </Menu.Item>
          <SubMenu key="usuarios" icon={<UserOutlined />} title="Usuários">
            <Menu.Item
              key="/usuarios"
              icon={<TableOutlined />}
              onClick={() => navigate('/usuarios')}
            >
              <Link to={'/usuarios'}>Consulta</Link>
            </Menu.Item>
            <Menu.Item
              key="/usuarios/cadastro"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate('/usuarios/cadastro')}
            >
              <Link to={'/usuarios/cadastro'}>Cadastro</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="pagamentos"
            icon={<LaptopOutlined />}
            title="Pagamentos"
          >
            <Menu.Item
              key="/pagamentos"
              icon={<TableOutlined />}
              onClick={() => navigate('/pagamentos')}
            >
              <Link to={'/pagamentos'}>Consulta</Link>
            </Menu.Item>
            <Menu.Item
              key="/pagamentos/cadastro"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate('/pagamentos/cadastro')}
            >
              <Link to={'/pagamentos/cadastro'}>Cadastro</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="fluxo-de-caixa"
            icon={<DiffOutlined />}
            title="Fluxo de caixa"
          >
            <Menu.Item
              key="/fluxo-de-caixa/despesas"
              icon={<FallOutlined />}
              onClick={() => navigate('/fluxo-de-caixa/despesas')}
            >
              <Link to={'/fluxo-de-caixa/despesas'}>Despesa</Link>
            </Menu.Item>
            <Menu.Item
              key="/fluxo-de-caixa/receitas"
              icon={<RiseOutlined />}
              onClick={() => navigate('/fluxo-de-caixa/receitas')}
            >
              <Link to={'/fluxo-de-caixa/receitas'}>Receita</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </SidebarWrapper>
    </>
  );
}
