import { Button, Space, Switch, Table, Tag, Typography } from 'antd';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { User } from 'rodolfohiok-sdk';
import useUsers from '../../core/hooks/useUsers';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';

export default function UserList() {
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <Table<User.Summary>
        dataSource={users}
        columns={[
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 180,
            render(name: string, row) {
              return (
                <Space>
                  <Avatar size="small" src={row.avatarUrls.small} />
                  <Typography.Text ellipsis style={{ maxWidth: 150 }}>
                    {name}
                  </Typography.Text>
                </Space>
              );
            },
          },
          {
            dataIndex: 'email',
            title: 'Email',
            width: 240,
            ellipsis: true,
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
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
            render(createdAt: string) {
              return format(new Date(createdAt), 'dd/MM/yyyy');
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            render(active) {
              return <Switch defaultChecked={active} />;
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
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
