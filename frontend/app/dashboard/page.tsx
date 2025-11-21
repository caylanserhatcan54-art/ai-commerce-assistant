"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [shopId, setShopId] = useState("");
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadShops(JSON.parse(userData!).email);
  }, []);

  async function loadShops(email: string) {
    try {
      const res = await fetch(`${API_BASE}/shops/list?owner=${email}`);
      const data = await res.json();

      if (data.success) {
        setShops(data.shops);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function createShop() {
    setCreateError(null);

    if (!shopId.trim()) {
      setCreateError("Shop ID boş olamaz.");
      return;
    }

    const res = await fetch(`${API_BASE}/shops/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopId,
        name: `${shopId} Shop`,
        owner: user.email,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      setCreateError(data.error || "Mağaza oluşturulamadı.");
    } else {
      loadShops(user.email);
      setShopId("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-2xl px-4 py-14">
        <h1 className="text-3xl font-bold mb-6">
          Hoş geldin, {user?.name} 👋
        </h1>

        {/* SHOP OLUŞTURMA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Yeni Shop Oluştur</h2>

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm mb-3"
            placeholder="Shop ID (ör: shop-abc123)"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
          />

          {createError && (
            <div className="text-red-400 text-sm mb-3">{createError}</div>
          )}

          <button
            onClick={createShop}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 text-sm"
          >
            Oluştur
          </button>
        </div>

        {/* SHOP LİSTESİ */}
        <h2 className="text-xl font-bold mb-4">Mağazaların</h2>

        <div className="space-y-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-1">{shop.name}</h3>
              <p className="text-sm text-slate-400 mb-3">Shop ID: {shop.id}</p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    router.push(`/shops/${shop.id}/embed`)
                  }
                  className="bg-green-600 hover:bg-green-500 text-sm px-3 py-2 rounded-md"
                >
                  Embed Kodları
                </button>

                <button
                  onClick={() =>
                    router.push(`/shops/${shop.id}/products`)
                  }
                  className="bg-blue-600 hover:bg-blue-500 text-sm px-3 py-2 rounded-md"
                >
                  Ürünler
                </button>

                <button
                  onClick={() =>
                    router.push(`/checkout?shopId=${shop.id}`)
                  }
                  className="bg-purple-600 hover:bg-purple-500 text-sm px-3 py-2 rounded-md"
                >
                  Ödeme Yap
                </button>
              </div>
            </div>
          ))}

          {shops.length === 0 && (
            <p className="text-center text-slate-400">
              Henüz mağazan yok. Yukarıdan bir tane oluştur!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
