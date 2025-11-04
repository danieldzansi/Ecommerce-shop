import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/CartStore";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");

    const rawBackend = import.meta.env.VITE_BACKEND_URL || "";
    const backend = rawBackend.replace(/\/$/, "") || window.location.origin;

    const verify = async () => {
      try {
        if (reference) {
          const url = new URL(`/api/paystack/verify`, backend);
          url.searchParams.set("reference", reference);
          await fetch(url.toString(), {
            headers: { Accept: "application/json" },
          });
        }
      } catch (err) {
      
        console.error("verify error", err?.message || err);
      } finally {
        try {
          clearCart();
        } catch {
          // ignore
        }
        navigate("/");
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default PaymentResult;
