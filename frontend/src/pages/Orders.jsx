import React, { useEffect, useState } from "react";

const isValidEmail = (e) => {
  return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
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
        <p className="mt-4 text-sm leading-6 text-[#314160]">
          Enter your email and order number to check the status of your order.
        </p>
      </div>

      <form
        className="mx-auto mt-10 max-w-4xl border border-[#DBCCB7] bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
      >
        <div className="mb-6 flex items-center gap-3 text-sm font-extrabold">
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
              placeholder="john@example.com"
              className="form-field mt-2"
            />
          </label>
          <label className="text-sm font-bold">
            Order Number
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-1234567890-123"
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

      {error && <p className="mx-auto mt-4 max-w-4xl text-sm text-red-600">{error}</p>}

      <div className="mx-auto mt-8 max-w-4xl">
        {orders.length === 0 && !loading && <p className="text-center text-sm text-[#6f5860]">No orders found.</p>}
        {orders.map((o) => (
          <div key={o.id} className="border-b border-[#DBCCB7]/60 py-5 text-[#1d1115]">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{o.id} — {o.status}
                </p>
                <p className="text-sm text-[#6f5860]">Total: {o.total_amount}</p>
                <p className="text-sm text-[#6f5860]">
                  Placed: {new Date(o.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <a
                  className="underline text-sm"
                  href={`/order-details?orderId=${
                    o.id
                  }&email=${encodeURIComponent(o.email)}`}
                >
                  View details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
