"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { parseJwt } from "@/utils/jwt";
import Toast from "@/components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [errorField, setErrorField] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast.message]);

  function showError(message, field) {
    setToast({ message, type: "error" });
    setErrorField(field);

    if (field === "email") emailRef.current?.focus();
    if (field === "password") passwordRef.current?.focus();
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!email) return showError("Email harus diisi.", "email");
    if (!password) return showError("Password harus diisi.", "password");

    const res = await login({ email, password });
    const token = res.token || res.data?.token;

    if (token) {
      localStorage.setItem("token", token);

      const tokenProfile = parseJwt(token);

      const profileData =
        res.user ||
        res.data?.user ||
        (res.data &&
        (res.data.name ||
          res.data.fullName ||
          res.data.username ||
          res.data.email)
          ? res.data
          : null) ||
        (tokenProfile &&
        (tokenProfile.name ||
          tokenProfile.fullName ||
          tokenProfile.username ||
          tokenProfile.email)
          ? tokenProfile
          : null);

      if (profileData && typeof profileData === "object") {
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      }

      setToast({
        message: "Login berhasil!",
        type: "success",
      });

      window.setTimeout(() => {
        router.push("/");
      }, 1200);

      return;
    }

    const message =
      res.message || "Login gagal. Periksa email dan password.";

    showError(message, "password");
  }

  return (
    <div className="min-h-screen bg-[#f6fbff] py-14">
      <div className="mx-auto max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900">Login</h1>

        <p className="mt-2 text-sm text-slate-500">
          Masuk untuk melanjutkan dan lihat menu makanan terbaru.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email

            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
                errorField === "email"
                  ? "border-rose-500 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="contoh@domain.com"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Password

            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
                errorField === "password"
                  ? "border-rose-500 ring-2 ring-rose-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="Masukkan password kamu"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary hover:opacity-80"
          >
            Login sekarang
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Daftar sekarang
          </a>
        </p>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}