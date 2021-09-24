import usePageTitle from '../../core/hooks/usePageTitle';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import EntryCRUD from '../features/EntryCRUD';

export default function CashFlowRevenuesView() {
  usePageTitle('Receitas');
  useBreadcrumb('Fluxo de caixa/Receitas');

  return <EntryCRUD type="REVENUE" />;
}
