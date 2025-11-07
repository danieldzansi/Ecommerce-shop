import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/orders/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load orders");
        setOrders(json.data || []);
      } catch (e) {
        console.error("Admin fetch orders error", e);
        setError(e.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) return <div>Loading orders…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">All Orders</h2>
      {orders.length === 0 && <p>No orders found.</p>}
      <div>
        {orders.map((o) => (
          <div key={o.id} className="border p-3 mb-2 rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Order #{o.id} — {o.status}
                </p>
                <p className="text-sm text-gray-600">Email: {o.email}</p>
                <p className="text-sm text-gray-600">Total: {o.total_amount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {new Date(o.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc ml-5">
                {(o.items || []).map((it, i) => (
                  <li key={i}>
                    {it.name} x {it.quantity} — {it.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
