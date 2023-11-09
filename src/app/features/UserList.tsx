import {
  Button,
  Space,
  Switch,
  Table,
  Tag,
  Card,
  Input,
  Descriptions,
  Tooltip,
  Row,
} from 'antd';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { User } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { ColumnProps } from 'antd/lib/table';
import { Link } from 'react-router-dom';
import Forbidden from '../components/Forbidden';
import { parseISO } from 'date-fns';

export default function UserList() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchUsers().catch((err) => {
      if (err?.data?.status === 403) {
        setForbidden(true);
        return;
      }
      throw err;
    });
  }, [fetchUsers]);

  const getColumnSearchProps = (
    dataIndex: keyof User.Summary,
    displayName?: string
  ): ColumnProps<User.Summary> => ({
    filterDropdown: ({
      selectedKeys,
      setSelectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Card>
        <Input
          style={{ marginBottom: 8, display: 'block' }}
          placeholder={`Buscar ${displayName || dataIndex}`}
          value={selectedKeys[0]?.toString()}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button
            type="primary"
            size={'small'}
            style={{ width: 90 }}
            icon={<SearchOutlined />}
            onClick={() => confirm()}
          >
            Buscar
          </Button>
          <Button size={'small'} style={{ width: 90 }} onClick={clearFilters}>
            Limpar
          </Button>
        </Space>
      </Card>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#0099FF' : undefined }} />
    ),
    //@ts-ignore
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : '',
  });

  if (forbidden) return <Forbidden />;

  return (
    <>
      <Row justify="end">
        <Button
          icon={<ReloadOutlined />}
          loading={fetching}
          onClick={() => fetchUsers()}
        >
          Atualizar
        </Button>
      </Row>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        pagination={false}
        rowKey={'id'}
        columns={[
          {
            title: 'Usuários',
            responsive: ['xs'],
            render(user: User.Summary) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Nome'}>
                    {user.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Email'}>
                    {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Perfil'}>
                    <Tag color={user.role === 'MANAGER' ? 'red' : 'blue'}>
                      {user.role === 'EDITOR'
                        ? 'Editor'
                        : user.role === 'MANAGER'
                        ? 'Gerente'
                        : user.role === 'ASSISTANT'
                        ? 'Assistente'
                        : user.role}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Criação'}>
                    {format(parseISO(user.createdAt), 'dd/MM/yyyy')}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Space>
                      <Tooltip title="Visualizar usuário" placement="left">
                        <Link to={`/usuarios/${user.id}`}>
                          <Button size="small" icon={<EyeOutlined />} />
                        </Link>
                      </Tooltip>
                      <Tooltip title="Editar usuário" placement="right">
                        <Link to={`/usuarios/edicao/${user.id}`}>
                          <Button size="small" icon={<EditOutlined />} />
                        </Link>
                      </Tooltip>
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'avatarUrls',
            title: '',
            width: 48,
            fixed: 'left',
            responsive: ['sm'],
            render(avatarUrls: User.Summary['avatarUrls']) {
              return <Avatar size="small" src={avatarUrls.small} />;
            },
          },
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 160,
            ellipsis: true,
            responsive: ['sm'],
            ...getColumnSearchProps('name', 'Nome'),
          },
          {
            dataIndex: 'email',
            title: 'Email',
            width: 240,
            ellipsis: true,
            responsive: ['md'],
            ...getColumnSearchProps('email', 'Email'),
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            sorter(a, b) {
              return a.role.localeCompare(b.role);
            },
            render(role) {
              return (
                <Tag color={role === 'MANAGER' ? 'red' : 'blue'}>
                  {role === 'EDITOR'
                    ? 'Editor'
                    : role === 'MANAGER'
                    ? 'Gerente'
                    : role === 'ASSISTANT'
                    ? 'Assistente'
                    : role}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'createdAt',
            title: 'Criação',
            align: 'center',
            width: 110,
            responsive: ['lg'],
            sorter(a, b) {
              return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
            },
            render(createdAt: string) {
              return format(parseISO(createdAt), 'dd/MM/yyyy');
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            width: 80,
            responsive: ['sm'],
            render(active, user) {
              return (
                <Switch
                  disabled={
                    (active && !user.canBeDeactivated) ||
                    (!active && !user.canBeActivated)
                  }
                  checked={active}
                  onChange={() => toggleUserStatus(user)}
                />
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(id: number) {
              return (
                <Space>
                  <Tooltip title="Visualizar usuário" placement="left">
                    <Link to={`/usuarios/${id}`}>
                      <Button size="small" icon={<EyeOutlined />} />
                    </Link>
                  </Tooltip>
                  <Tooltip title="Editar usuário" placement="right">
                    <Link to={`/usuarios/edicao/${id}`}>
                      <Button size="small" icon={<EditOutlined />} />
                    </Link>
                  </Tooltip>
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}
