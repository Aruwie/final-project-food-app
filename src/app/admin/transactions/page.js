"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAllTransactions,
  updateTransactionStatus,
} from "@/services/transaction";
import { getAllUsers } from "@/services/user";
import { formatRupiah } from "@/utils/formatRupiah";

const PAGE_SIZE = 10;

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const [transactionRes, userRes] = await Promise.all([
        getAllTransactions(),
        getAllUsers(),
      ]);

      if (
        transactionRes?.ok === false ||
        transactionRes?.status >= 400
      ) {
        setMessage(
          transactionRes?.message ||
            "Failed to load transactions."
        );

        setTransactions([]);
        return;
      }

      const trx =
        transactionRes?.data ||
        transactionRes?.transactions ||
        [];

      const userData =
        userRes?.data ||
        userRes?.users ||
        [];

      setTransactions(
        Array.isArray(trx)
          ? trx
          : []
      );

      setUsers(
        Array.isArray(userData)
          ? userData
          : []
      );

    } catch (err) {
      console.error(err);

      setMessage(
        "Failed to load transactions."
      );

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getUser(userId) {
    return (
      users.find(
        (user) => user.id === userId
      ) || null
    );
  }

  async function handleStatus(
    transactionId,
    status
  ) {
    const confirmUpdate = window.confirm(
      `Change transaction status to "${status}"?`
    );

    if (!confirmUpdate) return;

    try {
      setUpdating(true);
      setMessage("");

      const res =
        await updateTransactionStatus(
          transactionId,
          status
        );

      if (
        res?.ok === false ||
        res?.status >= 400
      ) {
        setMessage(
          res?.message ||
            "Failed to update status."
        );
        return;
      }

      await loadData();

      setMessage(
        "Transaction updated successfully."
      );

    } catch (err) {
      console.error(err);

      setMessage(
        "Failed to update status."
      );
    } finally {
      setUpdating(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    data.sort((a, b) => {
      const dateA = new Date(
        a.createdAt ||
        a.orderDate ||
        0
      ).getTime();

      const dateB = new Date(
        b.createdAt ||
        b.orderDate ||
        0
      ).getTime();

      return dateB - dateA;
    });

    if (statusFilter !== "all") {
      data = data.filter(
        (trx) =>
          (trx.status || "").toLowerCase() ===
          statusFilter
      );
    }

    if (query.trim()) {

      const keyword =
        query.toLowerCase();

      data = data.filter((trx) => {

        const user =
          getUser(trx.userId);

        return (
          String(trx.id)
            .toLowerCase()
            .includes(keyword) ||

          String(trx.invoiceId)
            .toLowerCase()
            .includes(keyword) ||

          String(user?.name || "")
            .toLowerCase()
            .includes(keyword)
        );

      });
    }

    return data;

  }, [
    transactions,
    users,
    query,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
      PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage *
        PAGE_SIZE
    );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handleFilter(e) {
    setStatusFilter(e.target.value);
    setPage(1);
  }

  function handlePrev() {
    setPage((p) =>
      Math.max(1, p - 1)
    );
  }

  function handleNext() {
    setPage((p) =>
      Math.min(totalPages, p + 1)
    );
  }

    return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.35em] text-primary">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Manage Transactions
            </h1>

            <p className="mt-2 text-slate-500">
              Total Transactions :{" "}
              <span className="font-semibold">
                {filteredTransactions.length}
              </span>
            </p>

          </div>

          <div className="flex flex-col gap-3 md:flex-row">

            <input
              value={query}
              onChange={handleSearch}
              placeholder="Search invoice, transaction or customer..."
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            />

            <select
              value={statusFilter}
              onChange={handleFilter}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-primary"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="success">
                Success
              </option>

              <option value="failed">
                Failed
              </option>

            </select>

          </div>

        </div>

        {message && (

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>

        )}

        {loading ? (

          <div className="mt-12 text-center text-slate-500">
            Loading transactions...
          </div>

        ) : filteredTransactions.length === 0 ? (

          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">

            <h2 className="text-xl font-bold">
              No Transactions Found
            </h2>

            <p className="mt-2 text-slate-500">
              There are no transactions matching your search.
            </p>

          </div>

        ) : (

          <>

            <div className="mt-10 space-y-5">

              {paginatedTransactions.map((trx) => {

                const customer =
                  getUser(trx.userId);

                const transactionId =
                  trx.id;

                const total =
                  trx.totalAmount ??
                  trx.totalPrice ??
                  trx.total ??
                  0;

                const paymentMethod =
                  trx.payment_method?.name ||
                  trx.paymentMethod?.name ||
                  trx.paymentMethod ||
                  "-";

                const createdAt =
                  trx.orderDate ||
                  trx.createdAt;

                const invoiceId =
                  trx.invoiceId ||
                  "-";

                                  return (
                  <div
                    key={transactionId}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:border-primary hover:shadow-md"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                      <div className="flex-1">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Invoice
                            </p>

                            <h2 className="mt-1 text-xl font-bold">
                              {invoiceId}
                            </h2>

                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize
                              ${
                                trx.status === "success"
                                  ? "bg-green-100 text-green-700"
                                  : trx.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {trx.status}
                          </span>

                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-2">

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Customer
                            </p>

                            <p className="mt-2 font-semibold">
                              {customer?.name || "-"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {customer?.email || "-"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {customer?.phoneNumber || "-"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Transaction
                            </p>

                            <p className="mt-2 break-all text-sm">
                              {transactionId}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Payment Method
                            </p>

                            <p className="mt-2 font-semibold">
                              {paymentMethod}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Order Date
                            </p>

                            <p className="mt-2">
                              {createdAt
                                ? new Date(
                                    createdAt
                                  ).toLocaleString()
                                : "-"}
                            </p>

                          </div>

                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4">

                          <div>

                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                              Total Payment
                            </p>

                            <h3 className="mt-2 text-2xl font-black text-primary">
                              {formatRupiah(total)}
                            </h3>

                          </div>

                          <Link
                            href={`/admin/transactions/${transactionId}`}
                            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold transition hover:bg-slate-100"
                          >
                            View Detail
                          </Link>

                        </div>

                      </div>

                      <div className="flex flex-col gap-3 lg:w-40">

                        <button
                          disabled={
                            updating ||
                            trx.status === "pending"
                          }
                          onClick={() =>
                            handleStatus(
                              transactionId,
                              "pending"
                            )
                          }
                          className="rounded-full bg-yellow-500 px-4 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Pending
                        </button>

                        <button
                          disabled={
                            updating ||
                            trx.status === "success"
                          }
                          onClick={() =>
                            handleStatus(
                              transactionId,
                              "success"
                            )
                          }
                          className="rounded-full bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Success
                        </button>

                        <button
                          disabled={
                            updating ||
                            trx.status === "failed"
                          }
                          onClick={() =>
                            handleStatus(
                              transactionId,
                              "failed"
                            )
                          }
                          className="rounded-full bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Failed
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

                          </div>

            <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Showing page{" "}
                  <span className="font-semibold text-slate-900">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {totalPages}
                  </span>
                </p>

                <p className="text-xs text-slate-400">
                  {filteredTransactions.length} transaction(s)
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="rounded-full border border-slate-300 px-5 py-2 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-slate-300 px-5 py-2 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

              </div>

            </div>

          </>
        )}

      </section>
    </main>
  );
}