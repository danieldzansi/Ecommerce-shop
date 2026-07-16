import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const currencySymbol = "GHS";

const formatMoney = (v) => {
  if (v == null) return "0.00";
  return Number(v).toFixed(2);
};

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles = {
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-[#DBCCB7]/25 text-[#5A0019] border-[#DBCCB7]",
  failed: "bg-red-50 text-red-700 border-red-200",
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
        setError("Missing orderId in the URL");
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

  if (loading) return <div className="page-x section-y">Loading order...</div>;
  if (error) return <div className="page-x section-y text-red-600">Error: {error}</div>;
  if (!order) return <div className="page-x section-y">No order found.</div>;

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

  const status = String(order.status || "pending").toLowerCase();

  return (
    <section className="page-x section-y mx-auto max-w-6xl">
      <div className="mb-10 flex flex-col gap-5 border-b border-[#DBCCB7]/60 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Order details</p>
          <h1 className="editorial-serif mt-3 text-4xl font-semibold md:text-5xl">Order #{order.id}</h1>
          <p className="mt-3 text-sm text-[#6f5860]">Placed {formatDate(order.created_at)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] ${statusStyles[status] || statusStyles.pending}`}>
            {status}
          </span>
          <Link to="/orders" className="btn-secondary min-h-0 px-5 py-3">
            Track another order
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <div className="border border-[#DBCCB7] bg-white p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#DBCCB7]/60 pb-4">
            <h2 className="editorial-serif text-2xl font-semibold">Delivery Details</h2>
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#5A0019]">Ghana delivery</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6f5860]">Customer</p>
              <p className="mt-3 font-semibold">{addressParts[0] || "Not provided"}</p>
              <p className="mt-1 text-sm text-[#6f5860]">{order.email}</p>
              {addressParts[1] && <p className="mt-1 text-sm text-[#6f5860]">{addressParts[1]}</p>}
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6f5860]">Address</p>
              <div className="mt-3 space-y-1 text-sm text-[#1d1115]">
                {addressParts.slice(2).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="border border-[#DBCCB7] bg-white p-6">
          <h2 className="editorial-serif text-2xl font-semibold">Order Summary</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-5">
              <span className="text-[#6f5860]">Reference</span>
              <span className="text-right font-semibold">{order.reference || "Pending"}</span>
            </div>
            <div className="flex justify-between gap-5">
              <span className="text-[#6f5860]">Items</span>
              <span className="font-semibold">{items.length}</span>
            </div>
            <div className="flex justify-between gap-5 border-t border-[#DBCCB7]/60 pt-4 text-base font-bold">
              <span>Total</span>
              <span>{currencySymbol} {formatMoney(order.total_amount)}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="border border-[#DBCCB7] bg-white p-6">
        <div className="mb-5 flex items-center justify-between border-b border-[#DBCCB7]/60 pb-4">
          <h2 className="editorial-serif text-2xl font-semibold">Order Items</h2>
          <span className="text-sm text-[#6f5860]">{items.length} item{items.length === 1 ? "" : "s"}</span>
        </div>

        {items.map((it, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_auto] items-center gap-5 border-b border-[#DBCCB7]/60 py-5 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={it.image?.[0]}
                alt={it.name}
                className="h-24 w-20 border border-[#DBCCB7] object-cover"
              />
              <div>
                <p className="font-semibold">{it.name}</p>
                <p className="mt-1 text-sm text-[#6f5860]">Quantity: {it.quantity}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#6f5860]">Unit price: {currencySymbol} {formatMoney(it.price)}</p>
              </div>
            </div>

            <div className="text-right font-semibold">
              {currencySymbol} {formatMoney(Number(it.price || 0) * Number(it.quantity || 1))}
            </div>
          </div>
        ))}

        <div className="ml-auto mt-6 max-w-sm space-y-3 border-t border-[#DBCCB7]/60 pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6f5860]">Subtotal</span>
            <span>{currencySymbol} {formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6f5860]">Shipping</span>
            <span>{currencySymbol} {formatMoney(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-[#DBCCB7]/60 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>{currencySymbol} {formatMoney(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
