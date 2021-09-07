import { useCallback, useState } from 'react';
import { Payment, PaymentService } from 'rodolfohiok-sdk';

export default function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();
  const [fetching, setFetching] = useState(false);

  const fetchPayments = useCallback(async (query: Payment.Query) => {
    setFetching(true);
    try {
      const payments = await PaymentService.getAllPayments(query);
      setPayments(payments);
    } finally {
      setFetching(false);
    }
  }, []);

  return {
    payments,
    fetching,
    fetchPayments,
  };
}
