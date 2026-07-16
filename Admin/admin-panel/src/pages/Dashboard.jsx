import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { backendUrl, Currency } from "../config";

const money = (value) =>
  `${Currency}${Number(value || 0).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const validDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const monthLabel = (date) =>
  date.toLocaleString("en-US", { month: "short", year: "2-digit" });

const RevenueChart = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="grid h-72 place-items-center rounded-[8px] border border-dashed border-slate-200 bg-slate-50 text-center">
        <div>
          <p className="font-bold text-slate-700">No confirmed payments yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Paid orders will appear here once payment is confirmed.
          </p>
        </div>
      </div>
    );
  }

  const width = 640;
  const height = 250;
  const padding = 28;
  const maxValue = Math.max(...data.map(([, value]) => value), 1);
  const points = data.map(([, value], index) => {
    const x =
      data.length === 1
        ? width / 2
        : padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y, value };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padding},${height - padding} ${line} ${width - padding},${height - padding}`;

  return (
    <div className="h-72 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img">
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5A0019" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5A0019" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((lineIndex) => {
          const y = padding + lineIndex * ((height - padding * 2) / 3);
          return (
            <line
              key={lineIndex}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#E2E8F0"
              strokeDasharray="4 6"
            />
          );
        })}
        <polyline points={area} fill="url(#revenueFill)" stroke="none" />
        <polyline
          points={line}
          fill="none"
          stroke="#5A0019"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <g key={data[index][0]}>
            <circle cx={point.x} cy={point.y} r="6" fill="#5A0019" />
            <text
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-slate-500 text-[13px]"
            >
              {data[index][0]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const statusTone = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  delivered: "bg-sky-50 text-sky-700 ring-sky-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const MetricCard = ({ title, value, note, icon }) => (
  <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
        <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#DBCCB7]/30 text-[#5A0019]">
        {icon}
      </span>
    </div>
    <p className="mt-3 text-sm leading-5 text-slate-500">{note}</p>
  </div>
);

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [productRes, orderRes] = await Promise.all([
          axios.get(`${backendUrl}/api/product/list`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/orders/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProducts(productRes.data?.allproducts || []);
        setOrders(orderRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadDashboard();
  }, [token]);

  const stats = useMemo(() => {
    const uniqueCustomers = new Set(orders.map((order) => order.email).filter(Boolean));
    const paidOrders = orders.filter(
      (order) => String(order.status).toLowerCase() === "paid"
    );
    const pendingOrders = orders.filter(
      (order) => String(order.status).toLowerCase() === "pending"
    );

    const totalOrderValue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );
    const paidValue = paidOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );
    const catalogValue = products.reduce(
      (sum, product) => sum + Number(product.price || 0),
      0
    );

    const statusCounts = orders.reduce((acc, order) => {
      const key = String(order.status || "pending").toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const categoryCounts = products.reduce((acc, product) => {
      const key = product.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const monthlyRevenueMap = paidOrders.reduce((acc, order) => {
      const date = validDate(order.created_at);
      if (!date) return acc;
      const key = monthLabel(date);
      acc[key] = (acc[key] || 0) + Number(order.total_amount || 0);
      return acc;
    }, {});

    const latestOrder = [...orders].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];

    return {
      uniqueCustomers: uniqueCustomers.size,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      totalOrderValue,
      paidValue,
      pendingValue: totalOrderValue - paidValue,
      catalogValue,
      bestsellers: products.filter((product) => product.bestseller).length,
      statusCounts,
      categoryCounts,
      monthlyRevenue: Object.entries(monthlyRevenueMap).slice(-6),
      latestOrder,
    };
  }, [orders, products]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5),
    [orders]
  );

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        .slice(0, 5),
    [products]
  );

  const maxCategory = Math.max(...Object.values(stats.categoryCounts), 1);
  const orderTotal = Math.max(orders.length, 1);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[8px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Real product, order, customer, and revenue information from the store.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/add"
            className="rounded-[8px] bg-[#5A0019] px-5 py-3 text-sm font-bold text-white shadow-sm"
          >
            Add product
          </Link>
          <Link
            to="/orders"
            className="rounded-[8px] border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:text-[#5A0019]"
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="flex w-fit rounded-[8px] border border-slate-200 bg-white p-1 shadow-sm">
        {["overview", "details"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-[8px] px-4 py-2 text-sm font-bold capitalize ${
              activeTab === tab
                ? "bg-[#5A0019] text-white"
                : "text-slate-500 hover:text-[#5A0019]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Products"
              value={products.length}
              note={`${stats.bestsellers} marked as bestseller`}
              icon={<FiBox className="h-5 w-5" />}
            />
            <MetricCard
              title="Orders"
              value={orders.length}
              note={`${stats.pendingOrders} pending, ${stats.paidOrders} paid`}
              icon={<FiShoppingBag className="h-5 w-5" />}
            />
            <MetricCard
              title="Confirmed paid"
              value={money(stats.paidValue)}
              note={`${money(stats.pendingValue)} still pending/unpaid`}
              icon={<FiDollarSign className="h-5 w-5" />}
            />
            <MetricCard
              title="Customers"
              value={stats.uniqueCustomers}
              note="Unique customer emails"
              icon={<FiUsers className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Revenue overview</h2>
                  <p className="text-sm text-slate-500">Confirmed paid revenue only</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                  {money(stats.paidValue)}
                </span>
              </div>
              <RevenueChart data={stats.monthlyRevenue} />
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Order status</h2>
              <p className="text-sm text-slate-500">Current distribution</p>
              <div className="mt-6 space-y-4">
                {Object.entries(stats.statusCounts).length === 0 && (
                  <p className="text-sm text-slate-500">No orders yet.</p>
                )}
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="capitalize text-slate-700">{status}</span>
                      <span className="font-bold text-slate-950">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[#5A0019]"
                        style={{ width: `${(count / orderTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Recent orders</h2>
              <div className="mt-5 space-y-3">
                {recentOrders.length === 0 && (
                  <p className="text-sm text-slate-500">No orders yet.</p>
                )}
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">Order #{order.id}</p>
                      <p className="text-sm text-slate-500">{order.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-950">{money(order.total_amount)}</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          statusTone[String(order.status).toLowerCase()] || statusTone.pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">Catalog mix</h2>
              <div className="mt-5 space-y-4">
                {Object.entries(stats.categoryCounts).map(([category, count]) => (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-700">{category}</span>
                      <span className="font-bold text-slate-950">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[#DBCCB7]"
                        style={{ width: `${(count / maxCategory) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#DBCCB7]/30 text-[#5A0019]">
                <FiActivity />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Store details</h2>
                <p className="text-sm text-slate-500">Backend-driven summary</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Catalog value</span>
                <span className="font-bold text-slate-950">{money(stats.catalogValue)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Latest order</span>
                <span className="font-bold text-slate-950">
                  {stats.latestOrder ? `#${stats.latestOrder.id}` : "None"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Last order date</span>
                <span className="font-bold text-slate-950">
                  {stats.latestOrder
                    ? new Date(stats.latestOrder.created_at).toLocaleString()
                    : "No orders yet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment status</span>
                <span className="font-bold text-slate-950">
                  {stats.paidOrders} paid / {stats.pendingOrders} pending
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#DBCCB7]/30 text-[#5A0019]">
                <FiLayers />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-950">Product details</h2>
                <p className="text-sm text-slate-500">Highest priced products in the catalog</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {topProducts.length === 0 && (
                <p className="text-sm text-slate-500">No products found.</p>
              )}
              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="flex items-center justify-between gap-4 rounded-[8px] border border-slate-200 px-4 py-3 hover:border-[#5A0019]/30 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="h-12 w-12 rounded-[8px] object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-950">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-950">{money(product.price)}</p>
                    {product.bestseller && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <FiCheckCircle /> Bestseller
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
