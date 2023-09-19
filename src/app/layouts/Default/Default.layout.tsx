import { ReactNode } from 'react';
import { Layout } from 'antd';
import DefaultLayoutHeader from './Header';
import DefaultLayoutSideBar2 from './SideBar2';
import DefaultLayoutBreadcrumb from './Breadcrumb';
import DefaultLayoutContent from './Content';

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <Layout>
      <DefaultLayoutHeader />
      <Layout id="PageLayout">
        <DefaultLayoutSideBar2 />
        <Layout style={{ padding: '0 24px 24px' }}>
          <DefaultLayoutBreadcrumb />
          <DefaultLayoutContent>{props.children}</DefaultLayoutContent>
        </Layout>
      </Layout>
    </Layout>
  );
}
