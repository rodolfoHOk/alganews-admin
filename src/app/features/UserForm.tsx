import {
  Col,
  Form,
  Row,
  Avatar,
  Input,
  DatePicker,
  Divider,
  Select,
  Tabs,
  Upload,
  Button,
  notification,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { FileService, User, UserService } from 'rodolfohiok-sdk';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';
import ImageCrop from 'antd-img-crop';
import { useEffect } from 'react';
import { MaskedInput } from 'antd-mask-input';
import { Moment } from 'moment';
import { useHistory } from 'react-router-dom';
import CurrencyInput from '../components/CurrencyInput';

const { TabPane } = Tabs;

type UserFormType = {
  createdAt: Moment;
  updatedAt: Moment;
  birthdate: Moment;
} & Omit<User.Detailed, 'createdAt' | 'updatedAt' | 'birthdate'>;

interface UserFormProps {
  user?: UserFormType;
  onUpdate?: (user: User.Input) => Promise<any>;
}

export default function UserForm(props: UserFormProps) {
  const history = useHistory();
  const [form] = Form.useForm<User.Input>();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(props.user?.avatarUrls.default || '');
  const [activeTab, setActiveTab] = useState<'personal' | 'bankAccount'>(
    'personal'
  );

  const handleAvatarUpload = useCallback(async (file: File) => {
    const avatarSource = await FileService.upload(file);
    setAvatar(avatarSource);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      avatarUrl: avatar || undefined,
    });
  }, [avatar, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={props.user}
      onFinishFailed={(fields) => {
        let bankAccountErrors = 0;
        let personalDataErrors = 0;

        fields.errorFields.forEach(({ name }) => {
          if (name.includes('bankAccount')) bankAccountErrors++;
          if (
            name.includes('location') ||
            name.includes('skills') ||
            name.includes('phone') ||
            name.includes('taxpayerId') ||
            name.includes('pricePerWord')
          )
            personalDataErrors++;
        });

        if (bankAccountErrors > personalDataErrors) setActiveTab('bankAccount');
        if (personalDataErrors > bankAccountErrors) setActiveTab('personal');
      }}
      onFinish={async (userInput: User.Input) => {
        setLoading(true);
        const userDTO: User.Input = {
          ...userInput,
          phone: userInput.phone.replace(/\D/g, ''),
          taxpayerId: userInput.taxpayerId.replace(/\D/g, ''),
        };

        if (props.user)
          return (
            props.onUpdate &&
            props.onUpdate(userDTO).finally(() => setLoading(false))
          );

        try {
          await UserService.insertNewUser(userDTO);
          history.push('/usuarios');
          notification.success({
            message: 'Sucesso',
            description: 'Usuário cadastrado com sucesso',
          });
        } catch (error) {
          if (error instanceof CustomError) {
            if (error.data?.objects) {
              form.setFields(
                error.data.objects.map((error) => {
                  return {
                    name: error.name
                      ?.split(/(\.|\[|\])/gi)
                      .filter(
                        (str) =>
                          str !== '.' &&
                          str !== '[' &&
                          str !== ']' &&
                          str !== ''
                      )
                      .map((str) =>
                        isNaN(Number(str)) ? str : Number(str)
                      ) as string[],
                    errors: [error.userMessage],
                  };
                })
              );
            } else {
              notification.error({
                message: error.message,
                description:
                  error.data?.detail === 'Network Error'
                    ? 'Erro na rede'
                    : error.data?.detail,
              });
            }
          } else {
            notification.error({
              message: 'Houve um erro',
            });
          }
        } finally {
          setLoading(false);
        }
      }}
    >
      <Row gutter={24} align="middle">
        <Col xs={24} lg={4}>
          <Row justify="center">
            <ImageCrop rotate shape={'round'} grid aspect={1 / 1}>
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  handleAvatarUpload(file);
                  return false;
                }}
                onRemove={() => {
                  setAvatar('');
                }}
                fileList={[
                  ...(avatar
                    ? [
                        {
                          name: 'Avatar',
                          uid: '',
                        },
                      ]
                    : []),
                ]}
              >
                <Avatar
                  style={{ cursor: 'pointer' }}
                  icon={<UserOutlined />}
                  size={128}
                  src={avatar}
                />
              </Upload>
            </ImageCrop>
            <Form.Item name={'avatarUrl'} hidden>
              <Input hidden />
            </Form.Item>
          </Row>
        </Col>
        <Col xs={24} lg={10}>
          <Form.Item
            label="Nome"
            name={'name'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'O campo não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input placeholder={'E.g.: João Silva'} />
          </Form.Item>
          <Form.Item
            label="Data de nascimento"
            name={'birthdate'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={10}>
          <Form.Item
            label="Bio"
            name={'bio'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'A biografia não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>
        <Col sm={24}>
          <Divider />
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label="Perfil de usuário"
            name={'role'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                type: 'enum',
                enum: ['EDITOR', 'ASSISTANT', 'MANAGER'],
                message: 'O perfil precisa ser editor, assitente ou gerente',
              },
            ]}
          >
            <Select placeholder="Selecione um perfil">
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTANT'}>Assitente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label="Email"
            name={'email'}
            rules={[
              {
                required: true,
                message: 'O campo é obrigatório',
              },
              {
                max: 255,
                message: 'O campo não pode ter mais de 255 caracteres',
              },
            ]}
          >
            <Input type="email" placeholder="E.g.: contato@joao.silva" />
          </Form.Item>
        </Col>
        <Col sm={24}>
          <Divider />
        </Col>
        <Col xs={24}>
          <Tabs
            defaultActiveKey="personal"
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab as 'personal' | 'bankAccount')}
          >
            <TabPane key="personal" tab="Dados pessoais">
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="País"
                    name={['location', 'country']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 50,
                        message: 'O campo não pode ter mais de 50 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="E.g.: Brasil" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Estado"
                    name={['location', 'state']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 50,
                        message: 'O campo não pode ter mais de 50 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="E.g.: Espírito Santo" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Cidade"
                    name={['location', 'city']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 255,
                        message: 'O campo não pode ter mais de 255 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="E.g.: Vitória" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Telefone"
                    name={'phone'}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 20,
                        message: 'O campo não pode ter mais de 20 caracteres',
                      },
                    ]}
                  >
                    <MaskedInput
                      mask="(11) 11111-1111"
                      placeholder="(12) 91234-4567"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="CPF"
                    name={'taxpayerId'}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        max: 14,
                        message: 'O campo não pode ter mais de 14 caracteres',
                      },
                    ]}
                  >
                    <MaskedInput
                      mask="111.111.111-11"
                      placeholder="123.456.789-01"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Preço por palavra"
                    name={'pricePerWord'}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        type: 'number',
                        min: 0.01,
                        message: 'O valor mínimo é 1 centavo',
                      },
                    ]}
                  >
                    <CurrencyInput
                      onChange={(e, value) =>
                        form.setFieldsValue({
                          pricePerWord: value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Col xs={18} lg={6}>
                          <Form.Item
                            label="Habilidade"
                            name={['skills', index, 'name']}
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              },
                              {
                                max: 50,
                                message:
                                  'O campo não pode ter mais de 50 caracteres',
                              },
                            ]}
                          >
                            <Input placeholder="E.g.: Javascript" />
                          </Form.Item>
                        </Col>
                        <Col xs={6} lg={2}>
                          <Form.Item
                            label="%"
                            name={['skills', index, 'percentage']}
                            rules={[
                              {
                                required: true,
                                message: '',
                              },
                              {
                                async validator(field, value) {
                                  if (isNaN(Number(value)))
                                    throw new Error('Apenas números');
                                  if (Number(value) > 100)
                                    throw new Error('Máximo é 100');
                                  if (Number(value) < 0)
                                    throw new Error('Mínimo é 0');
                                },
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    );
                  })}
              </Row>
            </TabPane>
            <TabPane key="bankAccount" tab="Dados bancários" forceRender>
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Instituição"
                    name={['bankAccount', 'bankCode']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        min: 3,
                        message: 'O campo deve ter no mínimo 3 caracteres',
                      },
                      {
                        max: 3,
                        message: 'O campo não pode ter mais de 3 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="123" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Agência"
                    name={['bankAccount', 'agency']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        min: 1,
                        message: 'O campo deve ter no mínimo 1 caractere',
                      },
                      {
                        max: 10,
                        message: 'O campo não pode ter mais de 10 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="1234" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Conta sem o dígito"
                    name={['bankAccount', 'number']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        min: 1,
                        message: 'O campo deve ter no mínimo 1 caractere',
                      },
                      {
                        max: 20,
                        message: 'O campo não pode ter mais de 20 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder="12345" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Dígito"
                    name={['bankAccount', 'digit']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                      {
                        min: 1,
                        message: 'O campo deve ter no mínimo 1 caractere',
                      },
                      {
                        max: 1,
                        message: 'O campo não pode ter mais de 1 caractere',
                      },
                    ]}
                  >
                    <Input placeholder="1" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label="Tipo de conta"
                    name={['bankAccount', 'type']}
                    rules={[
                      {
                        required: true,
                        message: 'O campo é obrigatório',
                      },
                    ]}
                  >
                    <Select placeholder="Selecione o tipo de conta">
                      <Select.Option value={'CHECKING'}>
                        Conta corrente
                      </Select.Option>
                      <Select.Option value={'SAVING'}>
                        Conta poupança
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
        <Col xs={24}>
          <Row justify="end">
            <Button type="primary" htmlType="submit" loading={loading}>
              {props.user ? 'Atualizar usuário' : 'Cadastrar usuário'}
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
