"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FoodForm from "@/components/FoodForm";
import Toast from "@/components/Toast";

import { createFood } from "@/services/food";

export default function AdminCreateFoodPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  async function handleCreate(foodData) {
    setLoading(true);

    try {
      const res = await createFood(foodData);

      if (!res.ok) {
        setToast({
          message: res.message || "Gagal menambahkan makanan",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Makanan berhasil ditambahkan",
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/foods");
      }, 1200);
    } catch (err) {
      console.error(err);

      setToast({
        message: "Terjadi kesalahan",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Create Food
          </h1>

          <p className="mt-2 text-slate-600">
            Tambahkan menu makanan baru.
          </p>
        </div>

        <FoodForm
          submitText="Create Food"
          loading={loading}
          onSubmit={handleCreate}
        />
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />
    </main>
  );
}