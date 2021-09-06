import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Popconfirm,
  Progress,
  Row,
  Skeleton,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import confirm from 'antd/lib/modal/confirm';
import { WarningFilled } from '@ant-design/icons';
import { useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import useUser from '../../core/hooks/useUser';
import usePosts from '../../core/hooks/usePosts';
import { Post } from 'rodolfohiok-sdk';
import moment from 'moment';
import usePageTitle from '../../core/hooks/usePageTitle';

export default function UserDetailsView() {
  usePageTitle('Detalhes do usuário');
  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound, toggleUserStatus } = useUser();
  const { posts, fetchPosts, togglePostStatus } = usePosts();

  const { lg } = useBreakpoint();

  useEffect(() => {
    if (!isNaN(Number(params.id))) fetchUser(Number(params.id));
  }, [fetchUser, params.id]);

  useEffect(() => {
    if (user?.role === 'EDITOR') fetchPosts(user.id);
  }, [fetchPosts, user]);

  if (isNaN(Number(params.id))) return <Redirect to={'/usuarios'} />;

  if (notFound) return <Card>Usuário não encontrado</Card>;

  if (!user) return <Skeleton />;

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} lg={4}>
          <Row justify="center">
            <Avatar size={120} src={user.avatarUrls.small} />
          </Row>
        </Col>
        <Col xs={24} lg={20}>
          <Space
            direction="vertical"
            style={{ width: '100%' }}
            align={lg ? 'start' : 'center'}
          >
            <Typography.Title level={2}>{user.name}</Typography.Title>
            <Typography.Paragraph
              style={{ textAlign: lg ? 'left' : 'center' }}
              ellipsis={{ rows: 2 }}
            >
              {user.bio}
            </Typography.Paragraph>
            <Space>
              <Link to={`/usuarios/edicao/${user.id}`}>
                <Button type="primary">Editar perfil</Button>
              </Link>
              <Popconfirm
                title={
                  user.active
                    ? `Desabilitar ${user.name}`
                    : `Habilitar ${user.name}`
                }
                onConfirm={() =>
                  confirm({
                    icon: <WarningFilled style={{ color: '#0099FF' }} />,
                    title: user.active
                      ? `Tem certeza que deseja desabilitar ${user.name}?`
                      : `Tem certeza que deseja habilitar ${user.name}?`,
                    content: user.active
                      ? 'Desabilitar um usuário fará com que ele seja automaticamente desligado da plataforma, podendo causar prejuízos em seus ganhos.'
                      : 'Habilitar um usuário fará com que ele ganhe acesso a plataforma novamente, possibilitando criação e publicação de posts.',
                    onOk() {
                      toggleUserStatus(user).then(() =>
                        fetchUser(Number(params.id))
                      );
                    },
                  })
                }
              >
                <Button type="primary">
                  {user.active ? 'Desabilitar' : 'Habilitar'}
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </Col>
        <Divider />
        <Col xs={24} lg={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {user.skills?.map((skill) => (
              <div key={skill.name}>
                <Typography.Text>{skill.name}</Typography.Text>
                <Progress percent={skill.percentage} success={{ percent: 0 }} />
              </div>
            ))}
          </Space>
        </Col>
        <Col xs={24} lg={12}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="País">
              {user.location.country}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {user.location.state}
            </Descriptions.Item>
            <Descriptions.Item label="Cidade">
              {user.location.city}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">{user.phone}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Divider />
        {user.role === 'EDITOR' && (
          <Col xs={24}>
            <Table<Post.Summary>
              dataSource={posts?.content}
              rowKey={'id'}
              columns={[
                {
                  title: 'Posts',
                  responsive: ['xs'],
                  render(post) {
                    return (
                      <Descriptions>
                        <Descriptions.Item label="Título">
                          {post.title}
                        </Descriptions.Item>
                        <Descriptions.Item label="Criação">
                          {moment(new Date(post.createdAt)).format(
                            'DD/MM/YYYY'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Última atualização">
                          {moment(new Date(post.updatedAt)).format(
                            'DD/MM/YYYY'
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Publicado">
                          <Switch
                            checked={post.published}
                            onChange={() =>
                              togglePostStatus(post).then(() =>
                                fetchPosts(user.id)
                              )
                            }
                          />
                        </Descriptions.Item>
                      </Descriptions>
                    );
                  },
                },
                {
                  dataIndex: 'title',
                  title: 'Título',
                  ellipsis: true,
                  width: 300,
                  responsive: ['sm'],
                  render(title: string) {
                    return <Tooltip title={title}>{title}</Tooltip>;
                  },
                },
                {
                  dataIndex: 'createdAt',
                  title: 'Criação',
                  width: 120,
                  align: 'center',
                  responsive: ['sm'],
                  render(createdAt: string) {
                    return moment(new Date(createdAt)).format('DD/MM/YYYY');
                  },
                },
                {
                  dataIndex: 'updatedAt',
                  title: 'Última atualização',
                  width: 200,
                  align: 'center',
                  responsive: ['sm'],
                  render(updatedAt: string) {
                    return moment(new Date(updatedAt)).format(
                      'DD/MM/YYYY [às] HH:mm'
                    );
                  },
                },
                {
                  dataIndex: 'published',
                  title: 'Publicado',
                  width: 100,
                  align: 'center',
                  responsive: ['sm'],
                  render(published, post) {
                    return (
                      <Switch
                        checked={published}
                        onChange={() =>
                          togglePostStatus(post).then(() => fetchPosts(user.id))
                        }
                      />
                    );
                  },
                },
              ]}
            />
          </Col>
        )}
      </Row>
    </>
  );
}
