"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/services/user";
import { parseJwt } from "@/utils/jwt";
import Toast from "@/components/Toast";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000 || timestamp);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

function normalizeProfileResponse(response) {
  if (!response || typeof response !== "object") return null;

  let profileData = response;
  if (profileData?.data && typeof profileData.data === "object") profileData = profileData.data;
  if (profileData?.profile && typeof profileData.profile === "object") profileData = profileData.profile;
  if (profileData?.user && typeof profileData.user === "object") {
    profileData = { ...profileData.user, ...profileData };
  }

  const hasProfileField = [
    "name",
    "fullName",
    "username",
    "email",
    "role",
    "createdAt",
    "created_at",
    "id",
    "_id",
  ].some((key) => profileData?.[key] !== undefined && profileData?.[key] !== null);

  if (!hasProfileField) return null;

  return {
    ...profileData,
    id:
      profileData?.id ||
      profileData?._id ||
      profileData?.user?.id ||
      profileData?.user?._id ||
      profileData?.userId ||
      profileData?.idUser ||
      null,
    name:
      profileData?.name ||
      profileData?.nama ||
      profileData?.fullName ||
      profileData?.full_name ||
      profileData?.firstName ||
      profileData?.first_name ||
      profileData?.username ||
      profileData?.user?.name ||
      profileData?.user?.nama ||
      profileData?.user?.fullName ||
      profileData?.user?.full_name ||
      profileData?.user?.firstName ||
      profileData?.user?.first_name ||
      profileData?.user?.username ||
      "",
    email:
      profileData?.email ||
      profileData?.user?.email ||
      profileData?.username ||
      "",
    role:
      profileData?.role ||
      profileData?.user?.role ||
      "customer",
    createdAt:
      profileData?.createdAt ||
      profileData?.created_at ||
      profileData?.user?.createdAt ||
      profileData?.user?.created_at ||
      null,
  };
}

function getLocalProfile() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("userProfile") || "null");
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getProfile();
        let data = normalizeProfileResponse(res);

        if (!data) {
          data = normalizeProfileResponse(getLocalProfile());
        }

        if (!data) {
          data = normalizeProfileResponse(parseJwt(token));
        }

        if (data) {
          setProfile(data);
          setEmail(data.email || "");
          localStorage.setItem("userProfile", JSON.stringify(data));
        } else {
          setError("Tidak dapat memuat data profil. Silakan login ulang.");
        }
      } catch (err) {
        console.error("Gagal memuat profil", err);
        let data = normalizeProfileResponse(getLocalProfile());
        if (!data) {
          data = normalizeProfileResponse(parseJwt(localStorage.getItem("token")));
        }
        if (data) {
          setProfile(data);
          setName(data.name || "");
          setEmail(data.email || "");
        } else {
          setError("Terjadi kesalahan saat memuat profil. Silakan login ulang.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    return () => window.clearTimeout(timer);
  }, [toast.message]);

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      const payload = { email };
      if (password) payload.password = password;
      if (profile?.name) payload.name = profile.name;

      const res = await updateProfile(payload);
      if (res?.ok) {
        const updated = normalizeProfileResponse(res);
        setProfile((prev) => ({ ...prev, ...updated }));
        setToast({ message: "Profil berhasil diperbarui.", type: "success" });
        setPassword("");

        const newToken = res.token || res.data?.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
        }
        return;
      }

      setError(res?.message || "Gagal memperbarui profil. Coba lagi nanti.");
      setToast({ message: res?.message || "Gagal memperbarui profil.", type: "error" });
    } catch (err) {
      console.error("Gagal memperbarui profil", err);
      setError("Terjadi kesalahan saat menyimpan profil.");
      setToast({ message: "Terjadi kesalahan saat menyimpan profil.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const tokenClaims = profile ? parseJwt(token) : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm">Memuat profil...</div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm text-center">
          <h1 className="text-3xl font-black text-slate-900">Akun belum aktif</h1>
          <p className="mt-4 text-slate-600">Silakan login untuk melihat dan mengelola data profil Anda.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Login</Link>
            <Link href="/register" className="rounded-full border border-amber-200 px-6 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50">Register</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_45%,#fff7ed_100%)] p-6 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-amber-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Profil Saya</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Akun Pengguna</h1>
          </div>
          <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Kembali ke Home</Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-slate-700">
            <p className="text-lg font-semibold">Ada masalah.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Informasi Akun</p>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
                <p className="mt-1 font-semibold text-slate-900 break-words">{profile?.email || profile?.user?.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Peran</p>
                <p className="mt-1 font-semibold text-slate-900">{profile?.role || profile?.user?.role || "customer"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Terdaftar sejak</p>
                <p className="mt-1 font-semibold text-slate-900">{formatDate(profile?.createdAt || profile?.created_at || tokenClaims?.iat)}</p>
              </div>
              {profile?.id || profile?._id || profile?.user?.id || profile?.user?._id ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">ID Pengguna</p>
                  <p className="mt-1 break-words text-sm text-slate-700">{profile?.id || profile?._id || profile?.user?.id || profile?.user?._id}</p>
                </div>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Perbarui Profil</h2>
            <p className="mt-2 text-sm text-slate-500">Ubah nama atau email, lalu simpan perubahan.</p>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="email@domain.com"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Password baru
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  placeholder="Biarkan kosong jika tidak ingin diubah"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Profil"}
              </button>
              <Link href="/transactions" className="text-sm font-semibold text-amber-600 hover:underline">Lihat riwayat transaksi</Link>
            </div>
          </form>
        </div>
      </section>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </main>
  );
}
