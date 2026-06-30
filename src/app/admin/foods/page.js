"use client";

import { useEffect, useMemo, useState } from "react";
import { getFoods, deleteFood } from "@/services/food";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/utils/formatRupiah";

const PAGE_SIZE = 12;

export default function AdminFoodsPage() {
  const router = useRouter();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchFoods = async () => {
      setLoading(true);

      try {
        const res = await getFoods();

        if (!isMounted) return;

        if (res.ok) {
          setFoods(res.data || []);
        } else {
          setMessage(res.message || "Gagal memuat data makanan");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setMessage("Gagal memuat data makanan");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFoods();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleEdit(id) {
    router.push(`/admin/foods/edit/${id}`);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus makanan ini?"
    );

    if (!confirmed) return;

    try {
      const res = await deleteFood(id);

      if (!res.ok) {
        setMessage(res.message || "Gagal menghapus makanan");
        return;
      }

      setMessage("Makanan berhasil dihapus.");

      const refresh = await getFoods();
      if (refresh.ok) {
        setFoods(refresh.data || []);
      }
    } catch (err) {
      console.error(err);
      setMessage("Gagal menghapus makanan");
    }
  }

  // 🔍 SEARCH (client-side)
  const filteredFoods = useMemo(() => {
    if (!query.trim()) return foods;

    return foods.filter((food) => {
      const name = food.name?.toLowerCase() || "";
      const desc = food.description?.toLowerCase() || "";
      const q = query.toLowerCase();

      return name.includes(q) || desc.includes(q);
    });
  }, [foods, query]);

  // 📄 PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredFoods.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pagedFoods = useMemo(() => {
    return filteredFoods.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [filteredFoods, currentPage]);

  function handleSearchChange(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function handleNext() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Manage Foods
            </h1>
          </div>

          <Link
            href="/admin/foods/create"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            + Add Food
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            {filteredFoods.length} item ditemukan
          </p>

          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search food..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none md:w-80"
          />
        </div>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {message}
          </p>
        )}

        {/* CONTENT */}
        {loading ? (
          <p className="mt-10 text-slate-500">Loading...</p>
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {pagedFoods.map((food) => (
                <div
                  key={food.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold">
                    {food.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {food.description}
                  </p>

                  <p className="mt-3 font-semibold text-primary">
                    {formatRupiah(food.price)}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleEdit(food.id)}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(food.id)}
                      className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-8 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 text-sm">
              <p className="text-slate-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="rounded-full border px-4 py-2 disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="rounded-full border px-4 py-2 disabled:opacity-50"
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