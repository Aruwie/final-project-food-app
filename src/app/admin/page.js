"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">
            Admin Panel
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Dashboard
          </h1>
          <p className="mt-3 text-slate-600">
            Kelola makanan dan transaksi dari satu tempat.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          
          {/* FOOD MANAGEMENT */}
          <Link
            href="/admin/foods"
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:bg-white"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Manage Foods
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tambah, edit, dan hapus menu makanan.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              Open
            </div>
          </Link>

          {/* TRANSACTIONS */}
          <Link
            href="/admin/transactions"
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:bg-white"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Manage Transactions
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Update status transaksi: pending, success, failed.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              Open
            </div>
          </Link>

        </div>
      </section>
    </main>
  );
}