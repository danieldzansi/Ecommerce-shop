import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/CartStore';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');

    const verify = async () => {
      // Best-effort verify call, but regardless of result we clear cart and return home immediately
      try {
        if (reference) {
          await fetch(`http://localhost:4000/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
            headers: { Accept: 'application/json' },
          });
        }
      } catch (err) {
        // ignore errors — proceed to clear cart and navigate home
        console.error('verify error', err?.message || err);
      } finally {
        try {
          clearCart();
        } catch {
          // ignore
        }
        navigate('/');
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // render nothing
};

export default PaymentResult;
