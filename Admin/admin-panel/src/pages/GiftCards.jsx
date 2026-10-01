import React, { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiDownload, FiGift } from "react-icons/fi";
import { toast } from "react-toastify";
import { backendUrl, Currency } from "../config";

const denominations = [2000, 3000, 5000, 10000];
const money = (value) => `${Currency}${Number(value || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const readApiJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Gift card API is unavailable. Check VITE_BACKEND_URL and deploy the updated backend.");
  }
  return response.json();
};

const downloadCodes = (batch, cards) => {
  const header = ["voucher_reference", "gift_card_code", "amount", "currency", "expiry_date"];
  const rows = cards.map((card) => [card.voucherReference, card.giftCardCode, card.amount, card.currency, card.expiryDate]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `eclat-gift-cards-batch-${batch.id}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const GiftCards = ({ token }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastExport, setLastExport] = useState(null);
  const [form, setForm] = useState({ denomination: 2000, quantity: 1, expiresAt: "" });

  const loadBatches = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/gift-cards/admin/batches`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.message || "Failed to load batches");
      setBatches(data.data || []);
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) loadBatches(); }, [token, loadBatches]);

  const generate = async (event) => {
    event.preventDefault();
    if (!window.confirm(`Generate ${form.quantity} inactive gift card(s) worth ${money(form.denomination)} each?`)) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/gift-cards/admin/batches`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(form),
      });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.message || "Generation failed");
      setLastExport(data.data);
      downloadCodes(data.data.batch, data.data.cards);
      toast.success("Batch generated and CSV downloaded");
      await loadBatches();
    } catch (error) { toast.error(error.message); }
    finally { setSubmitting(false); }
  };

  const activate = async (batch) => {
    if (!window.confirm("Activate all " + batch.card_count + " cards in batch #" + batch.id + "? The codes will become spendable immediately.")) return;
    try {
      const response = await fetch(`${backendUrl}/api/gift-cards/admin/batches/${batch.id}/activate`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await readApiJson(response);
      if (!response.ok) throw new Error(data.message || "Activation failed");
      toast.success("Batch activated");
      await loadBatches();
    } catch (error) { toast.error(error.message); }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div><p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Stored value</p><h1 className="mt-3 text-3xl font-bold">Gift cards</h1><p className="mt-2 text-sm text-slate-500">Generate secure gift card codes, download each batch, and activate the codes when they are ready to use.</p></div>
      <form onSubmit={generate} className="grid gap-4 rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700">Denomination<select className="mt-2 w-full rounded-[8px] border border-slate-300 bg-white p-3" value={form.denomination} onChange={(e) => setForm({ ...form, denomination: Number(e.target.value) })}>{denominations.map((value) => <option key={value} value={value}>{money(value)}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Quantity<input className="mt-2 w-full rounded-[8px] border border-slate-300 p-3" type="number" min="1" max="500" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></label>
        <label className="text-sm font-semibold text-slate-700">Expiry date<input className="mt-2 w-full rounded-[8px] border border-slate-300 p-3" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></label>
        <div className="md:col-span-2 lg:col-span-3"><button disabled={submitting} className="inline-flex items-center gap-2 rounded-[8px] bg-[#5A0019] px-5 py-3 font-bold text-white disabled:opacity-60"><FiGift />{submitting ? "Generating..." : "Generate inactive batch & download CSV"}</button></div>
      </form>
      {lastExport && <div className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><span>This is the only time batch #{lastExport.batch.id}&apos;s readable codes are available. Store the CSV securely.</span><button className="inline-flex items-center gap-2 font-bold" onClick={() => downloadCodes(lastExport.batch, lastExport.cards)}><FiDownload />Download again</button></div>}
      <div className="overflow-x-auto rounded-[8px] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Batch</th><th className="p-4">Value</th><th className="p-4">Cards</th><th className="p-4">Status</th><th className="p-4">Remaining</th><th className="p-4">Created</th><th className="p-4">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{!loading && batches.map((batch) => <tr key={batch.id}><td className="p-4 font-bold">#{batch.id}</td><td className="p-4">{money(batch.denomination)}</td><td className="p-4">{batch.card_count}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${batch.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{batch.status}</span></td><td className="p-4">{money(batch.remaining_value)}</td><td className="p-4 text-slate-500">{new Date(batch.created_at).toLocaleString()}</td><td className="p-4">{batch.status === "inactive" ? <button onClick={() => activate(batch)} className="inline-flex items-center gap-2 font-bold text-[#5A0019]"><FiCheckCircle />Activate</button> : "—"}</td></tr>)}</tbody>
        </table>{loading && <p className="p-6 text-slate-500">Loading batches...</p>}{!loading && batches.length === 0 && <p className="p-6 text-slate-500">No batches generated yet.</p>}
      </div>
    </section>
  );
};
export default GiftCards;
