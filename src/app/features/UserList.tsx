import { Button, Space, Switch, Table, Tag, Card, Input } from 'antd';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { User } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';
import { EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { ColumnProps } from 'antd/lib/table';

export default function UserList() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();

  useEffect(() => {
    fetchUsers();
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
          value={selectedKeys[0]}
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

  return (
    <>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        pagination={false}
        columns={[
          {
            dataIndex: 'avatarUrls',
            title: '',
            width: 48,
            fixed: 'left',
            render(avatarUrls: User.Summary['avatarUrls']) {
              return <Avatar size="small" src={avatarUrls.small} />;
            },
          },
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 160,
            ellipsis: true,
            ...getColumnSearchProps('name', 'Nome'),
          },
          {
            dataIndex: 'email',
            title: 'Email',
            width: 240,
            ellipsis: true,
            ...getColumnSearchProps('email', 'Email'),
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
            width: 100,
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
            render(createdAt: string) {
              return format(new Date(createdAt), 'dd/MM/yyyy');
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            width: 80,
            render(active, user) {
              return (
                <Switch
                  defaultChecked={active}
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
            render() {
              return (
                <Space>
                  <Button size="small" icon={<EyeOutlined />} />
                  <Button size="small" icon={<EditOutlined />} />
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}
