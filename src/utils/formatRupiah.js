export function formatRupiah(value) {
  if (value == null || value === "") return "Rp 0";

  const number = typeof value === "number" ? value : Number(String(value).replace(/[^0-9-]/g, ""));
  if (Number.isNaN(number)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}
