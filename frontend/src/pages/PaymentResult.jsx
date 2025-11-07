import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/CartStore";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const reference = searchParams.get("reference");

    const backend=(import.meta.env.VITE_BACKEND_URL)

      const verifyPayment = async () => {
      try {
        if (!reference) {
          console.warn("No payment reference found");
          return navigate("/");
        }

        const verifyUrl = `${backend}/api/paystack/verify?reference=${reference}`;

        const response = await fetch(verifyUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const result = await response.json();
        console.log("Payment verification result:", result);

        const payment = result.data || {};

        const orderId = payment?.metadata?.orderId || payment?.order_id || null;
       
        clearCart();

        if (orderId ) {
          return navigate(
            `/order-details?orderId=${encodeURIComponent(
              orderId
            )}`
          );
        }
        return navigate("/orders");
      } catch (error) {
        console.error("Verification error:", error);
        return navigate("/orders");
      }
    };

    verifyPayment();
  }, [navigate, searchParams, clearCart]);

  // return (
  //   <div style={{ textAlign: "center", marginTop: "40px" }}>
  //     {/* <h2>Confirming Payment...</h2>
  //     <p>Please wait while we verify your transaction.</p> */}
  //   </div>
  // );
};

export default PaymentResult;
