"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFoodDetail } from "@/services/food";
import { addCart } from "@/services/cart";
import { formatRupiah } from "@/utils/formatRupiah";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

export default function FoodDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [food, setFood] = useState(null);
  const [imageSrc, setImageSrc] = useState(PLACEHOLDER_IMAGE);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await getFoodDetail(id);
        const item = res.data || res;
        setFood(item);
        setImageSrc(item?.imageUrl || PLACEHOLDER_IMAGE);
      } catch (error) {
        console.error("Failed to load food detail", error);
      }
    }

    loadDetail();
  }, [id]);

  async function handleAddCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await addCart(id);
      setMessage("Menu berhasil ditambahkan ke keranjang.");
    } catch (error) {
      console.error("Failed to add to cart", error);
      setMessage("Tidak dapat menambahkan menu ke keranjang.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!food) {
    return <p className="p-6 text-slate-500">Loading detail menu...</p>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.95fr]">
        <article className="overflow-hidden rounded-[32px] border border-amber-100 bg-white shadow-sm">
          <div className="relative h-72 w-full lg:h-[420px]">
            <Image
              src={imageSrc}
              alt={food.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              onError={() => {
                if (imageSrc !== PLACEHOLDER_IMAGE) {
                  setImageSrc(PLACEHOLDER_IMAGE);
                }
              }}
            />
          </div>
        </article>

        <article className="rounded-[32px] border border-amber-100 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Food detail</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 lg:text-4xl">{food.name}</h1>
          <p className="mt-4 text-slate-600">{food.description || "Menu yang lezat, segar, dan cocok untuk segala suasana."}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">{formatRupiah(food.price)}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Kategori: {food.category || "Food"}</span>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">Rating: 4.8</span>
          </div>

          <div className="mt-8 rounded-3xl bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Kenapa pilihan ini menarik?</h2>
            <p className="mt-2 text-sm text-slate-600">Rasa yang autentik, porsi yang memuaskan, dan tampilan yang menggugah selera. Cocok untuk user yang ingin menikmati makanan favorit dengan cepat.</p>
          </div>

          {message ? <div className="mt-6 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div> : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddCart}
              disabled={submitting}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Menambahkan..." : "Tambah ke cart"}
            </button>
            <Link href="/cart" className="rounded-full border border-amber-200 px-5 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50">
              Lihat cart
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
