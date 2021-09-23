import { Avatar, Layout, Row } from 'antd';
import logo from '../../../assets/logo.svg';
import useAuth from '../../../core/hooks/useAuth';

const { Header } = Layout;

export default function DefaultLayoutHeader() {
  const { user } = useAuth();

  return (
    <Header className="header no-print">
      <div className="logo" />
      <Row
        justify="space-between"
        align="middle"
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
      >
        <img src={logo} alt="AlgaNews Admin" />
        <Avatar src={user?.avatarUrls.small} />
      </Row>
    </Header>
  );
}
