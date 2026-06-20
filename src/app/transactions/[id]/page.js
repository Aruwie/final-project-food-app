"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getTransactionById, updateTransactionProofPayment } from "@/services/transaction";
import { formatRupiah } from "@/utils/formatRupiah";

function normalizeItems(transaction) {
  const items =
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

  return items.map((item, index) => {
    const food = item.food || item.foodId || item.foodData || item;
    return {
      id: item.id || item._id || item.itemId || item.cartId || item.foodId || index,
      name: food?.name || item.name || "Menu",
      quantity: item.quantity ?? item.qty ?? item.amount ?? 1,
      price: food?.price ?? item.price ?? item.unitPrice ?? item.total ?? 0,
      imageUrl: food?.imageUrl || food?.image || item.imageUrl || item.image || "",
    };
  });
}

export default function TransactionDetailPage({ params }) {
  const { id } = use(params);
  const [transaction, setTransaction] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
  const [proofError, setProofError] = useState("");
  const [proofMessage, setProofMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTransaction() {
      setLoading(true);
      setError("");

      try {
        const res = await getTransactionById(id);
        if (res?.ok === false || res?.status >= 400) {
          setError(res?.message || "Gagal memuat detail transaksi.");
          return;
        }

        const data = res?.data || res || null;
        setTransaction(data);
        const proofUrl =
          data?.proofPaymentUrl || data?.proof_payment_url || data?.proofUrl || data?.proof || "";
        setProofPreview(proofUrl || "");
      } catch (err) {
        console.error("Failed to load transaction detail", err);
        setError("Terjadi kesalahan saat memuat detail transaksi.");
      } finally {
        setLoading(false);
      }
    }

    loadTransaction();
  }, [id]);

  function convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleProofFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setProofPreview("");
      return;
    }

    try {
      const dataUrl = await convertFileToDataUrl(file);
      setProofPreview(dataUrl);
      setProofError("");
      setProofMessage("");
    } catch (err) {
      console.error("Failed to read proof file", err);
      setProofError("Gagal memuat file bukti pembayaran. Pastikan file valid.");
    }
  }

  async function handleUploadProof() {
    if (!proofPreview) {
      setProofError("Pilih file bukti pembayaran terlebih dahulu.");
      return;
    }

    setProofUploading(true);
    setProofError("");
    setProofMessage("");

    try {
      const res = await updateTransactionProofPayment(transactionId, proofPreview);
      if (res?.ok === false || res?.status >= 400) {
        setProofError(res?.message || "Gagal mengunggah bukti pembayaran.");
        return;
      }

      const updatedData = res?.data || res || transaction;
      setTransaction(updatedData);
      setProofMessage("Bukti pembayaran berhasil diunggah. Tunggu verifikasi admin.");
    } catch (err) {
      console.error("Failed to upload proof payment", err);
      setProofError("Gagal mengunggah bukti pembayaran. Coba lagi nanti.");
    } finally {
      setProofUploading(false);
    }
  }

  const items = useMemo(() => normalizeItems(transaction || {}), [transaction]);
  const total =
    transaction?.totalPrice ?? transaction?.total ?? transaction?.amount ??
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const status = transaction?.status || "pending";
  const paymentMethod = transaction?.paymentMethod?.name || transaction?.paymentMethod || "-";
  const createdAt = transaction?.createdAt || transaction?.created_at || transaction?.updatedAt || "-";
  const transactionId = transaction?.id || transaction?._id || transaction?.transactionId || id;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-primary bg-white p-8 shadow-sm">Memuat detail transaksi...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-primary bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Transaction Detail</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Detail Pesanan</h1>
          </div>
          <Link href="/transactions" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Kembali ke riwayat
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-slate-700">
            <p className="text-lg font-semibold">Gagal memuat data.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">ID Transaksi</p>
                  <p className="mt-2 font-semibold text-slate-900 break-words">{transactionId}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Status</p>
                  <p className="mt-2 font-semibold text-slate-900">{status}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Metode pembayaran</p>
                  <p className="mt-2 font-semibold text-slate-900">{paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Tanggal</p>
                  <p className="mt-2 font-semibold text-slate-900">{new Date(createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Bukti Pembayaran</p>
                  <p className="mt-2 text-slate-600">Unggah atau lihat bukti transfer untuk transaksi ini.</p>
                </div>
                {proofMessage && <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{proofMessage}</p>}
              </div>

              {proofError && <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{proofError}</div>}

              <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">Pilih file bukti pembayaran</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofFileChange}
                    className="w-full text-sm text-slate-700"
                  />
                  <p className="text-sm text-slate-500">Unggah bukti pembayaran berupa gambar jika diminta. Format yang diterima: JPG, PNG, atau WEBP.</p>

                  <button
                    onClick={handleUploadProof}
                    disabled={proofUploading}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {proofUploading ? "Mengunggah..." : "Unggah bukti pembayaran"}
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-700">Preview atau bukti tersimpan</p>
                  {proofPreview ? (
                    <img src={proofPreview} alt="Bukti pembayaran" className="mt-4 h-56 w-full rounded-3xl object-contain" />
                  ) : (
                    <div className="mt-4 flex h-56 items-center justify-center rounded-3xl bg-slate-50 text-sm text-slate-500">
                      Belum ada bukti pembayaran.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Rincian Produk</p>
                <p className="text-sm text-slate-500">{items.length} item</p>
              </div>

              <div className="mt-5 space-y-4">
                {items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-primary bg-textalt p-6 text-center text-slate-700">
                    Tidak ada detail item yang tersedia untuk transaksi ini.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-200 text-sm text-slate-500">No image</div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{formatRupiah(item.price)}</p>
                        <p className="text-sm text-slate-500">Total: {formatRupiah(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">Total Pembayaran</p>
                  <p className="text-sm text-slate-500">Termasuk semua item transaksi.</p>
                </div>
                <p className="text-3xl font-black text-primary">{formatRupiah(total)}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
