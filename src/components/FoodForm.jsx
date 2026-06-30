"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/services/food";

const PLACEHOLDER = "/images/placeholder.png";

export default function FoodForm({
  initialData = null,
  submitText = "Save",
  loading = false,
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [priceDiscount, setPriceDiscount] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  if (!initialData) return;

  Promise.resolve().then(() => {
    setName(initialData.name || "");
    setDescription(initialData.description || "");
    setIngredients((initialData.ingredients || []).join(", "));
    setPrice(initialData.price || "");
    setPriceDiscount(initialData.priceDiscount || "");
    setImageUrl(initialData.imageUrl || "");
  });
}, [initialData]);

  async function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setImageUrl(preview);
  }

    async function handleSubmit(e) {
    e.preventDefault();

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        setUploading(true);

        const uploadRes = await uploadImage(imageFile);

        setUploading(false);

        if (!uploadRes.ok) {
          alert(uploadRes.message || "Upload gambar gagal");
          return;
        }

        finalImageUrl = uploadRes.url;
      }

      await onSubmit({
        name,
        description,
        imageUrl: finalImageUrl,
        ingredients: ingredients
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        price: Number(price),
        priceDiscount: Number(priceDiscount),
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
      setUploading(false);
    }
  }

    return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Food Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Description
        </label>

        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Ingredients
        </label>

        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ayam, Sambal, Nasi"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
        />

        <p className="mt-2 text-xs text-slate-500">
          Pisahkan dengan koma (,)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Discount Price
          </label>

          <input
            type="number"
            value={priceDiscount}
            onChange={(e) => setPriceDiscount(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Food Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full rounded-xl border border-slate-300 p-3"
        />

        <div className="mt-5">
          <Image
            src={imageUrl || PLACEHOLDER}
            alt="Preview"
            width={240}
            height={180}
            className="rounded-2xl border object-cover"
            unoptimized
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Uploading Image..."
          : loading
          ? "Saving..."
          : submitText}
      </button>
    </form>
  );
}