import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatRupiah } from "@/utils/formatRupiah";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

export default function FoodCard({ food }) {
  const [imageSrc, setImageSrc] = useState(food.imageUrl || PLACEHOLDER_IMAGE);

  return (
    <Link href={`/foods/${food.id}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={food.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
            onError={() => {
              if (imageSrc !== PLACEHOLDER_IMAGE) {
                setImageSrc(PLACEHOLDER_IMAGE);
              }
            }}
          />
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Popular</p>
              <h2 className="text-xl font-bold text-text">{food.name}</h2>
            </div>
            <span className="rounded-full bg-textalt px-3 py-1 text-sm font-semibold text-primary">{formatRupiah(food.price)}</span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2">{food.description || "Nikmati cita rasa yang hangat, segar, dan memuaskan."}</p>

          <button className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-textalt hover:text-primary">
            Lihat detail
          </button>
        </div>
      </article>
    </Link>
  );
}