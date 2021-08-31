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
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { FileService } from 'rodolfohiok-sdk';
import ImageCrop from 'antd-img-crop';

const { TabPane } = Tabs;

export default function UserForm() {
  const [avatar, setAvatar] = useState('');

  const handleAvatarUpload = useCallback(async (file: File) => {
    const avatarSource = await FileService.upload(file);
    setAvatar(avatarSource);
  }, []);

  return (
    <Form layout="vertical" onFinish={(form) => console.log(form)}>
      <Row gutter={24} align="middle">
        <Col lg={4}>
          <ImageCrop rotate shape={'round'} grid aspect={1 / 1}>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                handleAvatarUpload(file);
                return false;
              }}
              onRemove={() => setAvatar('')}
            >
              <Avatar
                style={{ cursor: 'pointer' }}
                icon={<UserOutlined />}
                size={128}
                src={avatar}
              />
            </Upload>
          </ImageCrop>
        </Col>
        <Col lg={10}>
          <Form.Item label="Nome" name={'name'}>
            <Input placeholder={'E.g.: João Silva'} />
          </Form.Item>
          <Form.Item label="Data de nascimento" name={'birthdate'}>
            <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />
          </Form.Item>
        </Col>
        <Col lg={10}>
          <Form.Item label="Bio" name={'bio'}>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Divider />
        </Col>
        <Col lg={12}>
          <Form.Item label="Perfil de usuário" name={'role'}>
            <Select placeholder="Selecione um perfil">
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTANT'}>Assitente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item label="Email" name={'email'}>
            <Input type="email" placeholder="E.g.: contato@joao.silva" />
          </Form.Item>
        </Col>
        <Col lg={24}>
          <Divider />
        </Col>
        <Col lg={24}>
          <Tabs defaultActiveKey="personal">
            <TabPane key="personal" tab="Dados pessoais">
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label="País" name={['location', 'country']}>
                    <Input placeholder="E.g.: Brasil" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Estado" name={['location', 'state']}>
                    <Input placeholder="E.g.: Espírito Santo" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Cidade" name={['location', 'city']}>
                    <Input placeholder="E.g.: Vitória" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Telefone" name={'phone'}>
                    <Input placeholder="(12) 91234-4567 " />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="CPF" name={'taxpayerId'}>
                    <Input placeholder="123.456.789-01" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Preço por palavra" name={'pricePerWord'}>
                    <Input placeholder="0,00" />
                  </Form.Item>
                </Col>
                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Col lg={6}>
                          <Form.Item
                            label="Habilidade"
                            name={['skills', index, 'name']}
                          >
                            <Input placeholder="E.g.: Javascript" />
                          </Form.Item>
                        </Col>
                        <Col lg={2}>
                          <Form.Item
                            label="%"
                            name={['skills', index, 'percentage']}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    );
                  })}
              </Row>
            </TabPane>
            <TabPane key="bankAccount" tab="Dados bancários">
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item
                    label="Instituição"
                    name={['bankAccount', 'bankCode']}
                  >
                    <Input placeholder="123" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Agência" name={['bankAccount', 'agency']}>
                    <Input placeholder="1234" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item
                    label="Conta sem o dígito"
                    name={['bankAccount', 'number']}
                  >
                    <Input placeholder="12345" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label="Dígito" name={['bankAccount', 'digit']}>
                    <Input placeholder="1" />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item
                    label="Tipo de conta"
                    name={['bankAccount', 'type']}
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
        <Col lg={24}>
          <Row justify="end">
            <Button type="primary" htmlType="submit">
              Cadastrar
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
