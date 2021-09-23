import { Key } from 'antd/lib/table/interface';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Payment } from 'rodolfohiok-sdk';
import { AppDispatch, RootState } from '../store';
import * as PaymentsActions from '../store/Payment.slice';

export default function usePayments() {
  const dispatch = useDispatch<AppDispatch>();

  const fetching = useSelector((state: RootState) => state.payment.fetching);
  const payments = useSelector((state: RootState) => state.payment.paginated);
  const query = useSelector((state: RootState) => state.payment.query);
  const selected = useSelector((state: RootState) => state.payment.selected);

  const fetchPayments = useCallback(
    () => dispatch(PaymentsActions.getAllPayments()).unwrap(),
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

  const setSelected = useCallback(
    (keys: Key[]) => dispatch(PaymentsActions.storeSelectedKeys(keys)),
    [dispatch]
  );

  const removePayment = useCallback(
    (paymentId: number) => dispatch(PaymentsActions.removePayment(paymentId)),
    [dispatch]
  );

  return {
    payments,
    fetching,
    query,
    selected,
    fetchPayments,
    approvePaymentsInBatch,
    setQuery,
    setSelected,
    removePayment,
  };
}
