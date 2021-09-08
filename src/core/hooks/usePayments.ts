import { useCallback, useState } from 'react';
import { Payment, PaymentService } from 'rodolfohiok-sdk';

export default function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();
  const [fetchingPayments, setFetchingPayments] = useState(false);

  const fetchPayments = useCallback(async (query: Payment.Query) => {
    setFetchingPayments(true);
    try {
      const payments = await PaymentService.getAllPayments(query);
      setPayments(payments);
    } finally {
      setFetchingPayments(false);
    }
  }, []);

  return {
    payments,
    fetchingPayments,
    fetchPayments,
  };
}
