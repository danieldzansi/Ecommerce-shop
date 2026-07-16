import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const isValidEmail = (e) => {
  return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
};

const formatMoney = (value) => Number(value || 0).toFixed(2);

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

const Orders = () => {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendBase = () => {
    const raw = import.meta.env.VITE_BACKEND_URL || "";
    return raw.replace(/\/$/, "") || "http://localhost:4000";
  };

  const fetchOrders = async (emailToUse) => {
    setError("");
    setLoading(true);
    try {
      const e = (emailToUse || email || "").trim();
      if (!isValidEmail(e))
        throw new Error("Please provide a valid email address");

      const url = new URL("/api/orders/user", backendBase());
      url.searchParams.set("email", e);

      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load orders");
      const nextOrders = json.data || [];
      setOrders(
        orderNumber.trim()
          ? nextOrders.filter((order) => String(order.id).includes(orderNumber.trim()))
          : nextOrders
      );
    } catch (err) {
      console.error("fetch orders error", err);
      setError(err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("email");
    if (q) {
      setEmail(q);
      fetchOrders(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="page-x section-y">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Orders</p>
        <h1 className="editorial-serif mt-3 text-4xl font-semibold">Track Your Order</h1>
        <p className="mt-4 text-sm leading-6 text-[#6f5860]">
          Enter the email used at checkout. Add an order number if you want to narrow the result.
        </p>
      </div>

      <form
        className="mx-auto mt-10 max-w-4xl border border-[#DBCCB7] bg-white p-6 shadow-[0_18px_60px_rgba(90,0,25,0.06)]"
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
      >
        <div className="mb-6 flex items-center gap-3 text-sm font-extrabold text-[#5A0019]">
          <svg viewBox="0 0 24 24" className="w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          Order Lookup
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold">
            Email Address
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-field mt-2"
            />
          </label>
          <label className="text-sm font-bold">
            Order Number
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="7"
              className="form-field mt-2"
            />
          </label>
        </div>
        <button
          className="btn-primary mt-5 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="mx-auto mt-4 max-w-4xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mx-auto mt-10 max-w-4xl">
        {orders.length === 0 && !loading && !error && (
          <div className="border border-[#DBCCB7] bg-white px-6 py-10 text-center">
            <p className="editorial-serif text-2xl font-semibold">No orders found</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f5860]">
              Try checking the email address or remove the order number filter.
            </p>
          </div>
        )}
        {orders.map((o) => (
          <div key={o.id} className="mb-4 border border-[#DBCCB7] bg-white p-5 text-[#1d1115]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="editorial-serif text-2xl font-semibold">Order #{o.id}</p>
                  <span className={`inline-flex border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] ${statusStyles[String(o.status || "pending").toLowerCase()] || statusStyles.pending}`}>
                    {o.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-1 text-sm text-[#6f5860] sm:grid-cols-3 sm:gap-6">
                  <p><span className="font-semibold text-[#1d1115]">Total:</span> GHS {formatMoney(o.total_amount)}</p>
                  <p><span className="font-semibold text-[#1d1115]">Placed:</span> {formatDate(o.created_at)}</p>
                  <p><span className="font-semibold text-[#1d1115]">Items:</span> {(o.items || []).length}</p>
                </div>
              </div>
              <div className="md:text-right">
                <Link
                  className="btn-secondary min-h-0 px-5 py-3"
                  to={`/order-details?orderId=${o.id}&email=${encodeURIComponent(o.email)}`}
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
