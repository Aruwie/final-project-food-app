export default function CartPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Cart</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Keranjang belanja</h1>
        <p className="mt-3 text-slate-600">Halaman ini siap dikembangkan menjadi fitur checkout dan riwayat pesanan pada checkpoint berikutnya.</p>

        <div className="mt-8 grid gap-4 rounded-3xl bg-amber-50 p-5 text-sm text-slate-700">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"> <span>Menu terpilih</span> <strong>0 item</strong> </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"> <span>Subtotal</span> <strong>Rp 0</strong> </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"> <span>Biaya pengiriman</span> <strong>Gratis</strong> </div>
        </div>
      </section>
    </main>
  );
}