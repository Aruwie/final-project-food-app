"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getTransactionById,
  updateTransactionStatus,
} from "@/services/transaction";
import { getAllUsers } from "@/services/user";
import { formatRupiah } from "@/utils/formatRupiah";

function normalizeItems(transaction) {
  const items =
    transaction.transaction_items ||
    transaction.items ||
    transaction.transactionItems ||
    transaction.orderItems ||
    transaction.details ||
    transaction.carts ||
    transaction.cartItems ||
    transaction.foods ||
    [];

  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => ({
    id:
      item.id ||
      item._id ||
      item.itemId ||
      item.cartId ||
      item.foodId ||
      index,
    name: item.name || item.food?.name || "Menu",
    quantity: item.quantity ?? item.qty ?? item.amount ?? 1,
    price:
      item.price ??
      item.food?.price ??
      item.unitPrice ??
      item.total ??
      0,
    imageUrl:
      item.imageUrl ||
      item.food?.imageUrl ||
      item.food?.image ||
      "",
  }));
}

export default function AdminTransactionDetailPage({ params }) {
  const { id } = use(params);

  const [transaction, setTransaction] = useState(null);
  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTransaction() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const [transactionRes, usersRes] = await Promise.all([
        getTransactionById(id),
        getAllUsers(),
      ]);

      if (
        transactionRes?.ok === false ||
        transactionRes?.status >= 400
      ) {
        setError(
          transactionRes?.message ||
            "Failed to load transaction."
        );
        return;
      }

      const trx = transactionRes?.data || transactionRes;

      setTransaction(trx);

      const users =
        usersRes?.data ||
        usersRes?.users ||
        [];

      const matchedUser = Array.isArray(users)
        ? users.find((user) => user.id === trx.userId)
        : null;

      setCustomer(matchedUser || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load transaction.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransaction();
  }, [id]);

  async function handleStatus(status) {
    const confirmUpdate = window.confirm(
      `Are you sure you want to change this transaction status to "${status}"?`
    );

    if (!confirmUpdate) return;

    setUpdating(true);
    setMessage("");

    try {
      const res = await updateTransactionStatus(id, status);

      if (res?.ok === false || res?.status >= 400) {
        setMessage(
          res?.message ||
            "Failed to update transaction status."
        );
        return;
      }

      await loadTransaction();

      setMessage("Transaction status updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update transaction status.");
    } finally {
      setUpdating(false);
    }
  }

  const items = useMemo(
    () => normalizeItems(transaction || {}),
    [transaction]
  );

  const total =
    transaction?.totalAmount ??
    transaction?.totalPrice ??
    transaction?.total ??
    items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  const status =
    transaction?.status || "pending";

  const paymentMethod =
    transaction?.payment_method?.name ||
    transaction?.paymentMethod?.name ||
    transaction?.paymentMethod ||
    "-";

  const invoiceId =
    transaction?.invoiceId || "-";

  const transactionId =
    transaction?.id ||
    transaction?._id ||
    id;

  const orderDate =
    transaction?.orderDate ||
    transaction?.createdAt;

  const expiredDate =
    transaction?.expiredDate;

  const proofPayment =
    transaction?.proofPaymentUrl ||
    "";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6fbff] p-6">
        <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8">
          Loading transaction...
        </section>
      </main>
    );
  }

    return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Transaction Detail
            </h1>
          </div>

          <Link
            href="/admin/transactions"
            className="rounded-full border border-slate-300 px-5 py-2 font-semibold hover:bg-slate-100"
          >
            Back
          </Link>

        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!error && transaction && (
          <>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <h2 className="mb-5 text-lg font-bold">
                  Transaction Information
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-slate-500">
                      Transaction ID
                    </p>

                    <p className="break-all font-semibold">
                      {transactionId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Invoice
                    </p>

                    <p className="font-semibold">
                      {invoiceId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Payment Method
                    </p>

                    <p className="font-semibold">
                      {paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Total
                    </p>

                    <p className="font-bold text-primary">
                      {formatRupiah(total)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Order Date
                    </p>

                    <p>
                      {orderDate
                        ? new Date(orderDate).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Expired Date
                    </p>

                    <p>
                      {expiredDate
                        ? new Date(expiredDate).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize
                      ${
                        status === "success"
                          ? "bg-green-100 text-green-700"
                          : status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>

                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <h2 className="mb-5 text-lg font-bold">
                  Customer Information
                </h2>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-slate-500">
                      Name
                    </p>

                    <p className="font-semibold">
                      {customer?.name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Email
                    </p>

                    <p>
                      {customer?.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Phone Number
                    </p>

                    <p>
                      {customer?.phoneNumber || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      User ID
                    </p>

                    <p className="break-all">
                      {transaction.userId}
                    </p>
                  </div>

                </div>

              </div>

            </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <h2 className="mb-5 text-lg font-bold">
                  Payment Information
                </h2>

                <div className="space-y-5">

                  {transaction?.payment_method?.imageUrl && (
                    <img
                      src={transaction.payment_method.imageUrl}
                      alt={paymentMethod}
                      className="h-12 object-contain"
                    />
                  )}

                  <div>
                    <p className="text-sm text-slate-500">
                      Bank
                    </p>

                    <p className="font-semibold">
                      {paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Virtual Account
                    </p>

                    <p className="font-semibold">
                      {transaction?.payment_method
                        ?.virtualAccountNumber || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Account Name
                    </p>

                    <p className="font-semibold">
                      {transaction?.payment_method
                        ?.virtualAccountName || "-"}
                    </p>
                  </div>

                </div>

              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">

                <h2 className="mb-5 text-lg font-bold">
                  Proof of Payment
                </h2>

                {proofPayment ? (
                  <img
                    src={proofPayment}
                    alt="Proof Payment"
                    className="h-72 w-full rounded-3xl border object-contain"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 text-slate-400">
                    Customer has not uploaded proof of payment.
                  </div>
                )}

              </div>

            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-lg font-bold">
                  Purchased Items
                </h2>

                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
                  {items.length} Items
                </span>

              </div>

              <div className="space-y-4">

                {items.map((item) => (

                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div className="flex items-center gap-4">

                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-200">
                          No Image
                        </div>
                      )}

                      <div>

                        <h3 className="font-semibold">
                          {item.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Qty : {item.quantity}
                        </p>

                        <p className="text-sm text-slate-500">
                          Price : {formatRupiah(item.price)}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-primary">
                        {formatRupiah(
                          item.price * item.quantity
                        )}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Total Transaction
                  </p>

                  <h2 className="mt-2 text-4xl font-black text-primary">
                    {formatRupiah(total)}
                  </h2>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    disabled={status === "pending" || updating}
                    onClick={() => handleStatus("pending")}
                    className="rounded-full bg-yellow-500 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Pending
                  </button>

                  <button
                    disabled={status === "success" || updating}
                    onClick={() => handleStatus("success")}
                    className="rounded-full bg-green-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Success
                  </button>

                  <button
                    disabled={status === "failed" || updating}
                    onClick={() => handleStatus("failed")}
                    className="rounded-full bg-red-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Failed
                  </button>

                </div>

              </div>

            </div>

          </>
        )}

      </section>
    </main>
  );
}