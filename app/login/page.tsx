"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { fetchUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      await fetchUser();
      router.push("/admin/dashboard");
    } else {
      const result = await res.json();
      setError(result.message || "Email atau password salah.");
    }
  }

  return (
    <div className="flex items-center justify-center mx-auto">
      <form onSubmit={handleLogin} className="p-12 bg-white border border-gray-300 shadow w-md rounded-xl">
        <h1 className="mb-4 text-4xl font-semibold tracking-wide text-center text-gray-900">Login</h1>
        <h3 className="mb-4 text-lg font-medium text-gray-500 tracking">Welcome Back, Admin!</h3>
        {error && <p className="mb-2 text-xs text-red-500">{error}</p>}

        <input
          className="w-full px-3 py-2 mb-3 rounded-lg focus:outline-none ring ring-gray-200 focus:ring-gray-400 placeholder:text-sm"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 mb-6 rounded-lg focus:outline-none ring ring-gray-200 focus:ring-gray-400 placeholder:text-sm"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full py-2 font-medium text-gray-100 bg-green-600 rounded-full cursor-pointer">
          Login
        </button>
      </form>
    </div>
  );
}
