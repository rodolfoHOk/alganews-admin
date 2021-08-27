import { Avatar, Layout, Row } from 'antd';
import logo from '../../../assets/logo.svg';

const { Header } = Layout;

export default function DefaultLayoutHeader() {
  return (
    <Header className="header">
      <div className="logo" />
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        <img src={logo} alt="AlgaNews Admin" />
        <Avatar />
      </Row>
    </Header>
  );
}
