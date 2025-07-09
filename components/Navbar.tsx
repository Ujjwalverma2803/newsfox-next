"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 w-full bg-black text-white shadow z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold text-white tracking-wide flex items-center gap-1 hover:text-red-500 transition-all duration-300"
        >
          <span className="text-2xl">🦊</span>
          <span className="text-red-500">NewsFox</span>
        </Link>

        {/* Center: Categories */}
        <div className="hidden md:flex gap-6">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/${cat}`}
              className={`capitalize text-sm font-medium hover:text-red-400 transition ${
                pathname === `/${cat}` ||
                (pathname === "/" && cat === "general")
                  ? "text-red-400"
                  : ""
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Right: User info and controls */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <p className="text-sm">Loading...</p>
          ) : session ? (
            <>
              <p className="hidden sm:block text-sm text-gray-300">
                Welcome,{" "}
                <span className="font-semibold">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </p>
              <Link
                href="/favorites"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 transition-transform group-hover:scale-110"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                           4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
                           2.09C13.09 3.81 14.76 3 16.5 3 19.58 
                           3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                           11.54L12 21.35z"
                  />
                </svg>
                <span className="text-sm font-medium">Favorites</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 transition"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
