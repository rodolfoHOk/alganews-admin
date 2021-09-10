import { useState, useCallback } from 'react';
import { Payment, PaymentService, Post } from 'rodolfohiok-sdk';

export default function usePayment() {
  const [payment, setPayment] = useState<Payment.Detailed>();
  const [posts, setPosts] = useState<Post.WithEarnings[]>([]);
  const [fetchingPayment, setFetchingPayment] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    try {
      setFetchingPayment(true);
      const payment = await PaymentService.getExistingPayments(paymentId);
      setPayment(payment);
    } finally {
      setFetchingPayment(false);
    }
  }, []);

  const fetchPosts = useCallback(async (paymentId: number) => {
    try {
      setFetchingPosts(true);
      const posts = await PaymentService.getExistingPaymentPosts(paymentId);
      setPosts(posts);
    } finally {
      setFetchingPosts(false);
    }
  }, []);

  return {
    payment,
    posts,
    fetchingPayment,
    fetchingPosts,
    fetchPayment,
    fetchPosts,
  };
}
