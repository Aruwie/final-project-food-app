"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCarts, updateCart, deleteCart } from "@/services/cart";
import { getPaymentMethods } from "@/services/payment";
import { createTransaction } from "@/services/transaction";
import { formatRupiah } from "@/utils/formatRupiah";

export default function CartPage() {
  const [carts, setCarts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));

    if (!token) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [cartRes, paymentRes] = await Promise.all([getCarts(), getPaymentMethods()]);
        const cartsData = cartRes?.data || cartRes?.carts || cartRes || [];
        const paymentsData = paymentRes?.data || paymentRes?.paymentMethods || paymentRes || [];

        setCarts(Array.isArray(cartsData) ? cartsData : []);
        setPaymentMethods(Array.isArray(paymentsData) ? paymentsData : []);

        if (Array.isArray(paymentsData) && paymentsData.length > 0) {
          const firstPayment = paymentsData[0];
          setSelectedPayment(firstPayment.id || firstPayment._id || firstPayment.paymentMethodId || "");
        }
      } catch (error) {
        console.error("Failed to load cart or payment methods", error);
        setMessage("Tidak dapat memuat data keranjang, silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const normalizedCarts = useMemo(() => {
    return carts.map((item) => {
      const food = item.food || item.foodId || item.foodData || item;
      return {
        id: item.id || item._id || item.cartId,
        quantity: item.quantity ?? item.qty ?? 1,
        name: food?.name || item.name || "Menu",
        imageUrl: food?.imageUrl || food?.image || "",
        price: food?.price ?? item.price ?? 0,
        productId: food?.id || food?._id || item.foodId,
      };
    });
  }, [carts]);

  const totalItems = normalizedCarts.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = normalizedCarts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();

  async function refreshCart() {
    try {
      const cartRes = await getCarts();
      const cartsData = cartRes?.data || cartRes?.carts || cartRes || [];
      setCarts(Array.isArray(cartsData) ? cartsData : []);
    } catch (error) {
      console.error("Refresh cart failed", error);
      setMessage("Gagal memperbarui keranjang.");
    }
  }

  async function handleQuantityChange(cartId, nextQuantity) {
    if (nextQuantity < 1) return;
    setSubmitting(true);
    setMessage("");
    try {
      await updateCart(cartId, nextQuantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to update cart", error);
      setMessage("Gagal memperbarui jumlah item.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(cartId) {
    setSubmitting(true);
    setMessage("");
    try {
      await deleteCart(cartId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to delete cart", error);
      setMessage("Gagal menghapus item dari keranjang.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckout() {
    if (!selectedPayment) {
      setMessage("Pilih metode pembayaran terlebih dahulu.");
      return;
    }
    if (!normalizedCarts.length) {
      setMessage("Keranjang kosong.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const cartIds = normalizedCarts.map((item) => item.id).filter(Boolean);
      const res = await createTransaction(cartIds, selectedPayment);

      if (res?.ok === false || res?.status >= 400) {
        setMessage(res?.message || "Pembayaran gagal, silakan coba lagi.");
        return;
      }

      await refreshCart();
      router.push("/transactions");
    } catch (error) {
      console.error("Checkout failed", error);
      setMessage("Pembayaran gagal, silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-primary bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Keranjang</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Keranjang belanja</h1>
            <p className="mt-3 text-slate-600">Kelola item dan lakukan checkout untuk memproses pesanan kamu.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
            <p>Total item</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalItems}</p>
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="mt-10 rounded-3xl border border-primary bg-textalt p-8 text-center text-slate-700">
            <p className="text-xl font-semibold">Login terlebih dahulu untuk melihat keranjang.</p>
            <p className="mt-2 text-sm">Jika sudah punya akun, login untuk melanjutkan belanja dan checkout.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/login" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Login</Link>
              <Link href="/register" className="rounded-full border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">Register</Link>
            </div>
          </div>
        ) : loading ? (
          <div className="mt-10 text-slate-600">Memuat keranjang...</div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {normalizedCarts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-primary bg-textalt p-8 text-center text-slate-700">
                  <p className="text-lg font-semibold">Keranjangmu masih kosong.</p>
                  <p className="mt-2 text-sm">Tambahkan menu favorit melalui detail makanan atau homepage.</p>
                  <Link href="/" className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Kembali ke menu</Link>
                </div>
              ) : (
                normalizedCarts.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-3xl object-cover" />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-200 text-sm text-slate-600">No image</div>
                        )}
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">{item.name}</h2>
                          <p className="mt-2 text-sm text-slate-600">{formatRupiah(item.price)} x {item.quantity}</p>
                          <p className="mt-1 text-sm text-slate-500">Total: {formatRupiah(item.price * item.quantity)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || submitting}
                            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="px-3 text-sm font-semibold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={submitting}
                            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={submitting}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary">Ringkasan</p>
                <div className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-4 text-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <strong>{formatRupiah(subtotal)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Biaya pengiriman</span>
                    <strong>Gratis</strong>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <strong>{formatRupiah(subtotal)}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700" htmlFor="payment-method">Metode pembayaran</label>
                <select
                  id="payment-method"
                  value={selectedPayment}
                  onChange={(event) => setSelectedPayment(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                >
                  {paymentMethods.length === 0 ? (
                    <option value="">Tidak ada metode pembayaran</option>
                  ) : (
                    paymentMethods.map((method) => (
                      <option key={method.id || method._id || method.paymentMethodId} value={method.id || method._id || method.paymentMethodId}>
                        {method.name || method.methodName || "Metode pembayaran"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {message ? <p className="rounded-3xl bg-amber-50 p-4 text-sm text-amber-700">{message}</p> : null}

              <button
                onClick={handleCheckout}
                disabled={submitting || normalizedCarts.length === 0 || !paymentMethods.length}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Checkout sekarang"}
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
