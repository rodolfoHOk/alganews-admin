import { Button, Typography } from 'antd';
import { WarningFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface NotFoundErrorProps {
  title: string;
  actionDestination: string;
  actionTitle: string;
}

export default function NotFoundError(props: NotFoundErrorProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <WarningFilled style={{ fontSize: 32 }} />
      <Typography.Title style={{ color: '#0099FF' }}>
        {props.title}
      </Typography.Title>
      <Typography.Text>
        O recurso que você está procurando não foi encontrado
      </Typography.Text>
      <Link to={props.actionDestination}>
        <Button type="primary">{props.actionTitle}</Button>
      </Link>
    </div>
  );
}
