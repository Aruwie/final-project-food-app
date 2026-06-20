"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth";
import Toast from "@/components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" });
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const repeatRef = useRef(null);

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    return () => window.clearTimeout(timer);
  }, [toast.message]);

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Nama harus diisi.";
    if (!form.email.trim()) nextErrors.email = "Email harus diisi.";
    if (!form.password) nextErrors.password = "Password harus diisi.";
    if (!form.passwordRepeat) nextErrors.passwordRepeat = "Ulangi password.";
    if (form.password && form.passwordRepeat && form.password !== form.passwordRepeat) {
      nextErrors.passwordRepeat = "Password tidak sama.";
    }
    setErrors(nextErrors);
    return nextErrors;
  }

  function focusFirstError(fieldErrors) {
    if (fieldErrors.name) return nameRef.current?.focus();
    if (fieldErrors.email) return emailRef.current?.focus();
    if (fieldErrors.password) return passwordRef.current?.focus();
    if (fieldErrors.passwordRepeat) return repeatRef.current?.focus();
  }

  async function handleRegister(e) {
    e.preventDefault();

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setToast({ message: "Perbaiki form terlebih dahulu.", type: "error" });
      focusFirstError(fieldErrors);
      return;
    }

    const res = await register({
      ...form,
      role: "user",
    });

    if (res.status === "OK" || res.message) {
      const profileData = res.user || res.data?.user || res.data || { name: form.name, email: form.email };
      if (profileData && typeof profileData === "object") {
        localStorage.setItem("userProfile", JSON.stringify({
          ...profileData,
          name: profileData.name || form.name,
          email: profileData.email || form.email,
        }));
      }
      setToast({ message: "Registrasi berhasil!", type: "success" });
      window.setTimeout(() => router.push("/login"), 1200);
      return;
    }

    setToast({ message: res.message || "Registrasi gagal. Coba lagi.", type: "error" });
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  }

  return (
    <div className="min-h-screen bg-[#f6fbff] py-14">
      <div className="mx-auto max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-500">Buat akun baru agar bisa langsung akses menu dan detail makanan.</p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Nama Lengkap
            <input
              ref={nameRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${errors.name ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
              placeholder="Nama lengkap kamu"
            />
            {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              ref={emailRef}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${errors.email ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
              placeholder="contoh@domain.com"
            />
            {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              ref={passwordRef}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${errors.password ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
              placeholder="Buat password"
            />
            {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Ulangi Password
            <input
              ref={repeatRef}
              name="passwordRepeat"
              type="password"
              value={form.passwordRepeat}
              onChange={handleChange}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${errors.passwordRepeat ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"}`}
              placeholder="Ulangi password"
            />
            {errors.passwordRepeat && <p className="mt-2 text-sm text-rose-600">{errors.passwordRepeat}</p>}
          </label>

          <button type="submit" className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary hover:opacity-80">
            Daftar sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <a href="/login" className="font-semibold text-primary hover:underline">Login di sini</a></p>
      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </div>
  );
}
