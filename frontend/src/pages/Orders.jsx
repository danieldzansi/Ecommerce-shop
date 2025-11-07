import React, { useEffect, useState } from "react";
import Title from "../components/Title";

const isValidEmail = (e) => {
  return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
};

const Orders = () => {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendBase = () =>
    (import.meta.env.VITE_BACKEND_URL) 


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
      setOrders(json.data || []);
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
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
      >
        <div className="flex gap-3 items-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border px-3 py-2 rounded w-80"
          />
          <button
            className="bg-black text-white px-4 py-2 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Lookup"}
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6">
        {orders.length === 0 && !loading && <p>No orders found.</p>}
        {orders.map((o) => (
          <div key={o.id} className="py-4 border-b text-gray-700">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{o.id} — {o.status}
                </p>
                <p className="text-sm text-gray-600">Total: {o.total_amount}</p>
                <p className="text-sm text-gray-600">
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
    </div>
  );
};

export default Orders;
