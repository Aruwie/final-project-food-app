"use client";

import { useEffect, useState } from "react";
import { getAllTransactions, updateTransactionStatus } from "@/services/transaction";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const res = await getAllTransactions();
      setTransactions(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatus(id, status) {
    try {
      await updateTransactionStatus(id, status);
      await loadData();
    } catch (err) {
      console.error("update failed", err);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Manage Transactions
          </h1>
        </div>

        {loading ? (
          <p className="mt-10 text-slate-500">Loading...</p>
        ) : (
          <div className="mt-10 space-y-4">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <p className="font-semibold">{trx.id}</p>
                <p className="text-sm text-slate-600">
                  Status: {trx.status}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleStatus(trx.id, "pending")}
                    className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatus(trx.id, "success")}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Success
                  </button>

                  <button
                    onClick={() => handleStatus(trx.id, "failed")}
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Failed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}