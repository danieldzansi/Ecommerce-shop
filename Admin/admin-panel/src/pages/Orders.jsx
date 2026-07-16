import React, { useEffect, useState } from "react";
import { FiClock, FiCreditCard, FiPackage } from "react-icons/fi";
import { backendUrl, Currency } from "../config";

const money = (value) =>
  `${Currency}${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  delivered: "bg-sky-50 text-sky-700 ring-sky-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

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

  const totalValue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );
  const pendingCount = orders.filter(
    (order) => String(order.status).toLowerCase() === "pending"
  ).length;
  const paidCount = orders.filter(
    (order) => String(order.status).toLowerCase() === "paid"
  ).length;

  if (loading) {
    return (
      <div className="grid min-h-[55vh] place-items-center text-slate-500">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[8px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Order Management
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">All orders</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review customer orders, delivery details, payment status, and totals.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Orders</p>
            <FiPackage className="text-[#5A0019]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-950">{orders.length}</p>
        </div>
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total value</p>
            <FiCreditCard className="text-[#5A0019]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-950">{money(totalValue)}</p>
        </div>
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Status</p>
            <FiClock className="text-[#5A0019]" />
          </div>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {pendingCount} pending | {paidCount} paid
          </p>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="rounded-[8px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No orders found.
        </div>
      )}

      <div className="grid gap-4">
        {orders.map((o) => (
          <article
            key={o.id}
            className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-bold text-slate-950">Order #{o.id}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ring-1 ${
                      statusTone[String(o.status).toLowerCase()] || statusTone.pending
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">Email: {o.email}</p>
                {o.address && (
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Delivery: {o.address}
                  </p>
                )}
              </div>
              <div className="rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 lg:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">
                  {money(o.total_amount)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(o.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Items
              </p>
              <div className="grid gap-2">
                {(o.items || []).map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-[8px] bg-slate-50 px-3 py-3 text-sm"
                  >
                    <span className="font-semibold text-slate-950">{it.name}</span>
                    <span className="text-slate-500">Qty {it.quantity}</span>
                    <span className="font-bold text-slate-950">{money(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Orders;
