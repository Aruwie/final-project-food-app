"use client";

import { useEffect, useMemo, useState } from "react";
import { getFoods } from "@/services/food";
import FoodCard from "@/components/FoodCard";

const PAGE_SIZE = 6;

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
  {
    id: 4,
    name: "Sate Ayam Madura",
    description: "Sate ayam dengan bumbu kecap dan sambal yang nikmat.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    price: 25000,
  },
  {
    id: 5,
    name: "Bakso Urat",
    description: "Bakso kenyal dengan kuah gurih dan topping segar.",
    imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=80",
    price: 18000,
  },
  {
    id: 6,
    name: "Soto Ayam Lamongan",
    description: "Soto ayam hangat dengan suwiran ayam dan bahan segar.",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    price: 17000,
  },
];

export default function Home() {
  const [foods, setFoods] = useState(fallbackFoods);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedFoods = filteredFoods.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(event) {
    setQuery(event.target.value);
    setPage(1);
  }

  function handlePrevPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-slate-950 shadow-2xl ring-1 ring-white/10">
          <div className="px-6 py-10 lg:px-12 lg:py-14">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Food App</p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Menu enak, cepat, dan jelas untuk setiap selera.</h1>
              <p className="max-w-2xl text-slate-300">
                Temukan nasi goreng, mie ayam, bakso, dan minuman favorit. Pesan lebih cepat dengan antarmuka yang sederhana dan fokus.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["4.8/5", "Rating user"],
                  ["10+", "Menu tersedia"],
                  ["24/7", "Support order"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                    <p className="text-3xl font-black text-white">{value}</p>
                    <p className="mt-2 text-sm text-slate-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section id="menu" className="mt-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Menu list</p>
              <h2 className="text-2xl font-bold text-slate-950">Pilih makanan favorit kamu</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">{filteredFoods.length} item ditemukan</p>
              <input
                value={query}
                onChange={handleSearchChange}
                placeholder="Cari nasi, mie, atau minuman..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 sm:w-72"
              />
            </div>
          </div>

          {filteredFoods.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center text-slate-500">Belum ada menu yang cocok dengan pencarian saat ini.</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pagedFoods.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm sm:flex-row">
                <p className="text-slate-500">Halaman {currentPage} dari {totalPages}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
