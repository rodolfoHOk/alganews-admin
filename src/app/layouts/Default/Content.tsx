import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Content } = Layout;

interface DefaultLayoutContentProps {
  children: ReactNode;
}

export default function DefaultLayoutContent(props: DefaultLayoutContentProps) {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
      }}
    >
      {props.children}
    </Content>
  );
}
