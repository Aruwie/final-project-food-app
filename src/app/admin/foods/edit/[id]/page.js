"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import FoodForm from "@/components/FoodForm";
import Toast from "@/components/Toast";

import { getFoodDetail, updateFood } from "@/services/food";

export default function AdminEditFoodPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  async function loadFood() {
    try {
      setFetching(true);

      const res = await getFoodDetail(id);

      if (!res.ok) {
        setToast({
          message: res.message || "Gagal mengambil data makanan",
          type: "error",
        });
        return;
      }

      setInitialData(res.data || res);
    } catch (err) {
      console.error(err);

      setToast({
        message: "Terjadi kesalahan saat load data",
        type: "error",
      });
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    loadFood();
  }, [id]);

  async function handleUpdate(foodData) {
    setLoading(true);

    try {
      const res = await updateFood(id, foodData);

      if (!res.ok) {
        setToast({
          message: res.message || "Gagal mengupdate makanan",
          type: "error",
        });
        return;
      }

      setToast({
        message: "Makanan berhasil diupdate",
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

  if (fetching) {
    return (
      <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
        <section className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading data makanan...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fbff] p-6 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Edit Food
          </h1>

          <p className="mt-2 text-slate-600">
            Update informasi menu makanan.
          </p>
        </div>

        <FoodForm
          initialData={initialData}
          submitText="Update Food"
          loading={loading}
          onSubmit={handleUpdate}
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