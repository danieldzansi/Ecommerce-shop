import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "../store/CartStore";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState("verifying"); 
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference = searchParams.get("reference");
    const rawBackend = import.meta.env.VITE_BACKEND_URL || "";
    const backend = rawBackend.replace(/\/$/, "") || "http://localhost:4000";

    const verifyPayment = async () => {
      try {
        if (!reference) {
          console.warn("No payment reference found");
          setStatus("error");
          setMessage("No payment reference found");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        const url = new URL("/api/paystack/verify", backend);
        url.searchParams.set("reference", reference);
        const verifyUrl = url.toString();

        const response = await fetch(verifyUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const contentType = response.headers.get("content-type") || "";
        let result;
        if (contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const text = await response.text();
          console.error(
            "Verification endpoint returned non-JSON response (first 1k chars):",
            text.slice(0, 1000)
          );
          throw new Error("Verification endpoint returned non-JSON response");
        }
        console.log("Payment verification result:", result);

        if (!result.success) {
          setStatus("error");
          setMessage("Payment verification failed");
          setTimeout(() => navigate("/orders"), 3000);
          return;
        }

        const payment = result.data || {};
        const orderId = payment?.metadata?.orderId || payment?.orderId || null;

        // setStatus("success");
        // setMessage("Payment successful! Redirecting...");

        clearCart();

        setTimeout(() => {
          if (orderId) {
            navigate(`/order-details?orderId=${encodeURIComponent(orderId)}`, {
              replace: true,
              state: { paymentSuccess: true },
            });
          } else {
            navigate("/orders", { replace: true });
          }
        }, 1500);
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification");
        setTimeout(() => navigate("/orders"), 3000);
      }
    };

    verifyPayment();
  }, [navigate, searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            {/* <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Payment Successful!
            </h2> */}
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="h-16 w-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
