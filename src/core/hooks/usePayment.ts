import { useState, useCallback } from 'react';
import { Payment, PaymentService, Post } from 'rodolfohiok-sdk';
import { ResourceNotFoundError } from 'rodolfohiok-sdk/dist/errors';

export default function usePayment() {
  const [payment, setPayment] = useState<Payment.Detailed>();
  const [posts, setPosts] = useState<Post.WithEarnings[]>([]);
  const [paymentPreview, setPaymentPreview] = useState<Payment.Preview>();

  const [fetchingPayment, setFetchingPayment] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchingPaymentPreview, setFetchingPaymentPreview] = useState(false);
  const [schedulingPayment, setSchedulingPayment] = useState(false);

  const [paymentNotFound, setPaymentNotFound] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    try {
      setFetchingPayment(true);
      const payment = await PaymentService.getExistingPayments(paymentId);
      setPayment(payment);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setPaymentNotFound(true);
        return;
      }
      throw error;
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

  const fetchPaymentPreview = useCallback(
    async (paymentPreviewInput: Payment.PreviewInput) => {
      try {
        setFetchingPaymentPreview(true);
        const preview = await PaymentService.getPaymentPreview(
          paymentPreviewInput
        );
        setPaymentPreview(preview);
      } finally {
        setFetchingPaymentPreview(false);
      }
    },
    []
  );

  const clearPaymentPreview = useCallback(() => {
    setPaymentPreview(undefined);
  }, []);

  const schedulePayment = useCallback(async (paymentInput: Payment.Input) => {
    try {
      setSchedulingPayment(true);
      await PaymentService.insertNewPayment(paymentInput);
    } finally {
      setSchedulingPayment(false);
    }
  }, []);

  return {
    payment,
    posts,
    paymentPreview,
    fetchingPayment,
    fetchingPosts,
    fetchingPaymentPreview,
    schedulingPayment,
    paymentNotFound,
    fetchPayment,
    fetchPosts,
    fetchPaymentPreview,
    clearPaymentPreview,
    schedulePayment,
  };
}
