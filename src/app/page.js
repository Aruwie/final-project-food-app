"use client";

import { useEffect, useMemo, useState } from "react";
import { getFoods } from "@/services/food";
import FoodCard from "@/components/FoodCard";

export default function Home() {
  const fallbackFoods = [
    {
      id: 1,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan ayam, telur, dan sambal khas.",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
      price: 28000,
    },
    {
      id: 2,
      name: "Mie Ayam Premium",
      description: "Mie ayam hangat dengan topping ayam suwir dan pangsit.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
      price: 22000,
    },
    {
      id: 3,
      name: "Es Jeruk Segar",
      description: "Minuman segar dengan jeruk asli dan es batu.",
      imageUrl: "https://images.unsplash.com/photo-1523377668803-6f3b6e2f1590?auto=format&fit=crop&w=900&q=80",
      price: 12000,
    },
  ];

  const [foods, setFoods] = useState(fallbackFoods);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getFoods();
        if (Array.isArray(res.data) && res.data.length > 0) {
          setFoods(res.data);
        }
      } catch (error) {
        console.error("Failed to load foods", error);
      }
    }

    fetchData();
  }, []);

  const filteredFoods = useMemo(() => {
    if (!query.trim()) return foods;

    return foods.filter((food) =>
      food.name?.toLowerCase().includes(query.toLowerCase()) ||
      food.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [foods, query]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] text-slate-900">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-xl lg:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Checkpoint 1 • Food App</p>
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Temukan menu favoritmu, pesan dengan cepat, dan nikmati pengalaman kuliner yang seru.</h1>
              <p className="mt-4 max-w-xl text-slate-200">Halaman user ini menampilkan katalog makanan, detail produk, dan navigasi yang siap digunakan sebagai checkpoint front end final project.</p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <span className="rounded-full bg-white/10 px-4 py-2">Responsive</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Tailwind</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Next.js</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 shadow-inner">
              <p className="text-sm text-amber-100">Cari menu</p>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Coba cari nasi, mie, atau minuman..."
                className="mt-3 w-full rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-slate-800 outline-none ring-0 placeholder:text-slate-400"
              />
              <div className="mt-4 grid gap-3 text-sm text-slate-100">
                <div className="rounded-2xl bg-white/10 p-4">🍱 Menu lengkap & menarik</div>
                <div className="rounded-2xl bg-white/10 p-4">🚚 Fast delivery experience</div>
                <div className="rounded-2xl bg-white/10 p-4">💳 Siap integrasi checkout</div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Why users love it</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Desain yang fokus pada pengalaman user</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>• Tampilan hero, filter, dan katalog makanan yang rapi.</li>
              <li>• Detail menu untuk membantu user memutuskan pilihan.</li>
              <li>• Navigasi sederhana menuju cart, login, dan register.</li>
            </ul>
          </article>

          <article className="grid gap-4 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:grid-cols-3">
            {[
              ["10+", "Menu unggulan"],
              ["4.8/5", "Rating user"],
              ["24/7", "Support order"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-amber-50 p-4 text-center">
                <div className="text-3xl font-black text-amber-700">{value}</div>
                <p className="mt-1 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </article>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500">Menu list</p>
              <h2 className="text-2xl font-bold text-slate-900">Pilih makanan favorit kamu</h2>
            </div>
            <p className="text-sm text-slate-500">{filteredFoods.length} item ditemukan</p>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center text-slate-500">Belum ada menu yang cocok dengan pencarian saat ini.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}