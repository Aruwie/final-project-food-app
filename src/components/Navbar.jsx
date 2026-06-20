"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTokenRole } from "@/utils/jwt";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  function updateAuthState() {
    const token = localStorage.getItem("token");

    setIsLoggedIn(Boolean(token));
    setIsAdmin(getTokenRole(token) === "admin");
  }

  useEffect(() => {
    // initial load
    updateAuthState();

    // listen perubahan login
    const handleAuthChange = () => updateAuthState();

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setIsAdmin(false);

    window.dispatchEvent(new Event("auth-change"));

    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b-3 border-primary bg-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/">
          <img src="images/logo.png" alt="logo" className="h-6 w-auto" />
        </Link>

        <div className="flex items-center gap-3 text-sm font-semibold text-text">
          {!isAdmin && (
            <>
              <Link href="/" className="rounded-full px-3 py-2 hover:bg-primary hover:text-white">
                Home
              </Link>
              <Link href="/cart" className="rounded-full px-3 py-2 hover:bg-primary hover:text-white">
                Cart
              </Link>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <Link
              href="/transactions"
              className="rounded-full px-3 py-2 hover:bg-primary hover:text-white"
            >
              Transactions
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full px-3 py-2 hover:bg-primary hover:text-white"
            >
              Admin
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-full bg-primary px-4 py-2 text-white hover:bg-secondary"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full bg-primary px-4 py-2 text-white hover:bg-secondary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-primary px-4 py-2 text-primary hover:bg-primary hover:text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}