import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/CartStore";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const reference = params.get("reference") || params.get("trxref");

    const backend = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") 
      || "https://ecommerce-shop-production-ddc9.up.railway.app";

    const verifyPayment = async () => {
      try {
        if (!reference) {
          console.warn("No payment reference was found in the URL.");
          return navigate("/");
        }

        // ✅ Send both reference and trxref to backend
        const verifyUrl = `${backend}/api/paystack/verify?reference=${reference}&trxref=${reference}`;

        const response = await fetch(verifyUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await response.json();
        console.log("Verification Response:", data);

        if (data?.status === "success" || data?.message === "Payment verified") {
          clearCart();
          return navigate("/success");
        } else {
          return navigate("/failed");
        }

      } catch (error) {
        console.error("Verification error:", error);
        return navigate("/failed");
      }
    };

    verifyPayment();
  }, [location, navigate, clearCart]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Confirming Payment...</h2>
      <p>Please wait while we verify your transaction.</p>
    </div>
  );
};

export default PaymentResult;
