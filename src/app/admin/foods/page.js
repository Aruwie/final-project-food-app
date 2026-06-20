"use client";

import { useEffect, useState } from "react";
import { getFoods, deleteFood } from "@/services/food";
import Link from "next/link";
import { formatRupiah } from "@/utils/formatRupiah";

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadFoods() {
    setLoading(true);
    try {
      const res = await getFoods();
      setFoods(res?.data || []);
    } catch (err) {
      setMessage("Gagal memuat data makanan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteFood(id);
      await loadFoods();
    } catch (err) {
      setMessage("Gagal menghapus makanan");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-black">Manage Foods</h1>
          </div>

          <Link
            href="/admin/foods/create"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            + Add Food
          </Link>
        </div>

        {message && (
          <p className="mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">
            {message}
          </p>
        )}

        {loading ? (
          <p className="mt-10 text-slate-500">Loading...</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {foods.map((food) => (
              <div
                key={food.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">{food.name}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  {food.description}
                </p>

                <p className="mt-3 font-semibold text-primary">
                  {formatRupiah(food.price)}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleDelete(food.id)}
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
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