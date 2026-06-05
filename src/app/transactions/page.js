"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyTransactions } from "@/services/transaction";
import { formatRupiah } from "@/utils/formatRupiah";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function loadTransactions() {
    setLoading(true);
    setError("");

    try {
      const res = await getMyTransactions();
      if (res?.ok === false || res?.status >= 400) {
        setError(res?.message || "Gagal memuat transaksi.");
        setTransactions([]);
        return;
      }

      const data = res?.data || res?.transactions || res || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load transactions", error);
      setError("Gagal memuat transaksi. Coba lagi nanti.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));

    if (!token) {
      setLoading(false);
      return;
    }

    loadTransactions();
  }, []);

  const emptyState = (
    <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-slate-700">
      <p className="text-lg font-semibold">Belum ada transaksi.</p>
      <p className="mt-2 text-sm">Tambahkan menu ke keranjang dan lakukan checkout untuk melihat transaksi di sini.</p>
      <Link href="/" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        Kembali ke menu
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Transactions</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Riwayat Pesanan</h1>
        <p className="mt-3 text-slate-600">Lihat transaksi yang sudah dibuat dari keranjang dan pembayaran.</p>

        {loading ? (
          <div className="mt-8 text-slate-600">Memuat transaksi...</div>
        ) : !isLoggedIn ? (
          <div className="mt-8 rounded-3xl border border-amber-100 bg-amber-50 p-8 text-center text-slate-700">
            <p className="text-lg font-semibold">Silakan login untuk melihat riwayat pesanan.</p>
            <Link href="/login" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Login sekarang
            </Link>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-slate-700">
            <p className="text-lg font-semibold">Gagal memuat transaksi.</p>
            <p className="mt-2 text-sm">{error}</p>
            <button
              onClick={loadTransactions}
              className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Coba lagi
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="mt-8">{emptyState}</div>
        ) : (
          <div className="mt-8 space-y-4">
            {transactions.map((transaction) => {
              const total = transaction.totalPrice ?? transaction.total ?? transaction.amount ?? 0;
              const status = transaction.status ?? "pending";
              const paymentMethod = transaction.paymentMethod?.name || transaction.paymentMethod || "-";
              const createdAt = transaction.createdAt || transaction.created_at || transaction.updatedAt || "-";
              const transactionId = transaction.id || transaction._id || transaction.transactionId;

              const statusClasses =
                status === "success"
                  ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                  : status === "failed"
                  ? "rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                  : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700";

              return (
                <article key={transactionId} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">ID Transaksi</p>
                      <p className="mt-2 font-semibold text-slate-900">{transactionId}</p>
                      <p className="mt-2 text-sm text-slate-600">Metode pembayaran: {paymentMethod}</p>
                      <p className="mt-1 text-sm text-slate-600">Tanggal: {new Date(createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col items-start rounded-3xl bg-white p-4 text-slate-700 shadow-sm sm:items-end">
                      <span className="text-sm text-slate-500">Status</span>
                      <span className={`${statusClasses} mt-2`}>{status}</span>
                      <span className="mt-3 text-sm text-amber-600">{formatRupiah(total)}</span>
                      <Link
                        href={`/transactions/${transactionId}`}
                        className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Lihat detail
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
