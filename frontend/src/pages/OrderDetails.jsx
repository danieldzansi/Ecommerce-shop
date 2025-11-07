import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const currencySymbol = "GHS";

const formatMoney = (v) => {
  if (v == null) return "0.00";
  return Number(v).toFixed(2);
};

const OrderDetails = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        setError("Missing orderId or email in the URL");
        setLoading(false);
        return;
      }

      try {
        const raw = import.meta.env.VITE_BACKEND_URL || "";
        const backend = raw.replace(/\/$/, "") || "http://localhost:4000";
        const url = new URL("/api/orders/view", backend);
        url.searchParams.set("orderId", orderId);

        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch order");
        setOrder(json.data);
      } catch (e) {
        console.error("OrderDetails fetch error", e);
        setError(e.message || "Error fetching order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) return <div className="p-6">Loading order…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!order) return <div className="p-6">No order found.</div>;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );
  const shipping = Math.max(0, Number(order.total_amount || 0) - subtotal);

  const addressParts = (order.address || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Order #{order.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Customer Information</h3>
          <div className="font-semibold mb-3">
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p className="mt-3">
              <strong>Billing Details</strong>
            </p>
            {addressParts.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <p>
            <strong>Total:</strong> {currencySymbol}{" "}
            {formatMoney(order.total_amount)}
          </p>
          <p>
            <strong>Reference:</strong> {order.reference || "—"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        {items.map((it, idx) => (
          <div key={idx} className="flex justify-between mb-2">
            <div>
              {it.name} x {it.quantity}
            </div>
            <div>
              {currencySymbol} {formatMoney(it.price)}
            </div>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currencySymbol} {formatMoney(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {currencySymbol} {formatMoney(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>
              {currencySymbol} {formatMoney(order.total_amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
