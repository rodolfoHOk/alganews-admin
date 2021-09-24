import usePageTitle from '../../core/hooks/usePageTitle';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import EntryCRUD from '../features/EntryCRUD';

export default function CashFlowExpensesView() {
  usePageTitle('Despesas');
  useBreadcrumb('Fluxo de caixa/Despesas');

  return <EntryCRUD type="EXPENSE" />;
}
