import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-amber-600">
          <span className="rounded-xl bg-amber-500 px-2 py-1 text-white">🍜</span>
          YumFood
        </Link>

        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <Link href="/" className="rounded-full px-3 py-2 hover:bg-amber-50">Home</Link>
          <Link href="/cart" className="rounded-full px-3 py-2 hover:bg-amber-50">Cart</Link>
          <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Login</Link>
          <Link href="/register" className="rounded-full border border-amber-200 px-4 py-2 text-amber-700 hover:bg-amber-50">Register</Link>
        </div>
      </nav>
    </header>
  );
}
