"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    console.log("REGISTER DATA:", form);

    const res = await register({
      ...form,
      role: "user",
    });

    console.log("REGISTER RESULT:", res);

    if (res.status === "OK" || res.message) {
      alert("Register success");
      router.push("/login");
    } else {
      alert("Register gagal");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Name"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="passwordRepeat"
          type="password"
          placeholder="Repeat Password"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <button type="submit" className="bg-black text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}