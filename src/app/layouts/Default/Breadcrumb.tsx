import { Breadcrumb } from 'antd';
import useBreadcrumb from '../../../core/hooks/useBreadcrumb';

export default function DefaultLayoutBreadcrumb() {
  const { breadcrumb } = useBreadcrumb();

  return (
    <Breadcrumb style={{ margin: '16px 0' }} className="no-print">
      {breadcrumb.map((item, index) => (
        <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
