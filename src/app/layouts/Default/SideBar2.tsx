import { useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  HomeOutlined,
  TableOutlined,
  PlusCircleOutlined,
  DiffOutlined,
  FallOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Home', '/', <HomeOutlined />),
  getItem('Usuários', 'usuarios', <UserOutlined />, [
    getItem('Consulta', '/usuarios', <TableOutlined />),
    getItem('Cadastro', '/usuarios/cadastro', <PlusCircleOutlined />),
  ]),
  getItem('Pagamentos', 'pagamentos', <LaptopOutlined />, [
    getItem('Consulta', '/pagamentos', <TableOutlined />),
    getItem('Cadastro', '/pagamentos/cadastro', <PlusCircleOutlined />),
  ]),
  getItem('Fluxo de caixa', 'fluxo-de-caixa', <DiffOutlined />, [
    getItem('Despesa', '/fluxo-de-caixa/despesas', <FallOutlined />),
    getItem('Receita', '/fluxo-de-caixa/receitas', <RiseOutlined />),
  ]),
];

const rootSubmenuKeys = ['usuarios', 'pagamentos', 'fluxo-de-caixa'];

export default function DefaultLayoutSideBar2() {
  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState([
    'usuarios',
    'pagamentos',
    'fluxo-de-caixa',
  ]);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Sider>
      <Menu
        style={{ height: '100vh' }}
        onClick={onClick}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}
