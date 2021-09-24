import usePageTitle from '../../core/hooks/usePageTitle';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import PaymentForm from '../features/PaymentForm';

export default function PaymentCreateView() {
  usePageTitle('Cadastro de pagamentos');
  useBreadcrumb('Pagamentos/Cadastro');

  return (
    <>
      <PaymentForm />
    </>
  );
}
