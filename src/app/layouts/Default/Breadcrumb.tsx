import { Breadcrumb } from 'antd';
import useBreadcrumb from '../../../core/hooks/useBreadcrumb';

export default function DefaultLayoutBreadcrumb() {
  const { breadcrumb } = useBreadcrumb();

  let breadcrumbItens: { title: string }[] = [];
  breadcrumb.forEach((item) => breadcrumbItens.push({ title: item }));

  return (
    <Breadcrumb
      style={{ margin: '16px 0' }}
      className="no-print"
      items={breadcrumbItens}
    />
  );
}
