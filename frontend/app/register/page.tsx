"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:4000/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError(null);

    if (!name || !email || !password) {
      setError("Tüm alanlar zorunlu.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Kayıt başarısız");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Sunucu hatası");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Kayıt Ol</h1>

        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div>
            <label className="block text-sm mb-1">Ad Soyad</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Şifre</label>
            <input
              type="password"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-sm font-semibold rounded-md py-2 disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-md py-2 mt-2"
          >
            Zaten hesabın var mı? Giriş yap
          </button>
        </div>
      </div>
    </div>
  );
}
