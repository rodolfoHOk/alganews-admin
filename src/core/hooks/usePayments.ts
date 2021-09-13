import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Payment } from 'rodolfohiok-sdk';
import { RootState } from '../store';
import * as PaymentsActions from '../store/Payment.slice';

export default function usePayments() {
  const dispatch = useDispatch();

  const fetching = useSelector((state: RootState) => state.payment.fetching);
  const payments = useSelector((state: RootState) => state.payment.paginated);
  const query = useSelector((state: RootState) => state.payment.query);

  const fetchPayments = useCallback(
    () => dispatch(PaymentsActions.getAllPayments()),
    [dispatch]
  );

  const approvePaymentsInBatch = useCallback(
    (paymentIds: number[]) =>
      dispatch(PaymentsActions.approvePaymentsInBatch(paymentIds)),
    [dispatch]
  );

  const setQuery = useCallback(
    (query: Payment.Query) => dispatch(PaymentsActions.setQuery(query)),
    [dispatch]
  );

  return {
    payments,
    fetching,
    query,
    fetchPayments,
    approvePaymentsInBatch,
    setQuery,
  };
}
