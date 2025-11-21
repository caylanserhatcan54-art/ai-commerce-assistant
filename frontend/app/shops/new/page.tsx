"use client";

import { useState } from "react";

const API_BASE = "http://localhost:4000/api"; // prod’da .env ile değiştirirsin
const WIDGET_URL = "https://YOUR_DOMAIN.com/chat-widget.js"; // şimdilik placeholder

export default function CreateShopPage() {
  const [shopName, setShopName] = useState("");
  const [shopierId, setShopierId] = useState("");
  const [widgetColor, setWidgetColor] = useState("#4a69ff");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdShopId, setCreatedShopId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateShop() {
    setError(null);

    if (!shopName.trim()) {
      setError("Mağaza adı zorunlu.");
      return;
    }

    setLoading(true);

    // Basit Shop ID üretimi (prod’da backend de üretebilir)
    const shopId =
      "SHOP-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const res = await fetch(`${API_BASE}/shops/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          name: shopName.trim(),
          shopierId: shopierId.trim(),
          widgetColor,
          logoUrl: logoUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Mağaza oluşturulamadı.");
      } else {
        setCreatedShopId(shopId);
      }
    } catch (err: any) {
      setError(err.message || "Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-start justify-center">
      <div className="w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Yeni Mağaza Oluştur / Embed Kodu Al
        </h1>

        <p className="text-sm text-slate-300 mb-6">
          Mağaza sahibinden aldığın bilgileri gir. Mağaza oluşturulduktan sonra
          aşağıda Customer (Müşteri) ve Admin (Mağaza Sahibi) için ayrı embed
          kodları hazır çıkacak.
        </p>

        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Mağaza Adı
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Örn: Desenyum Case"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Shopier Mağaza ID (opsiyonel ama tavsiye edilir)
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shopierId}
              onChange={(e) => setShopierId(e.target.value)}
              placeholder="Örn: 82733594"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Widget Rengi
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="h-9 w-12 rounded-md border border-slate-700 bg-slate-950"
                value={widgetColor}
                onChange={(e) => setWidgetColor(e.target.value)}
              />
              <span className="text-xs text-slate-300">{widgetColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Logo URL (opsiyonel)
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://site.com/logo.png"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 border border-red-700/60 bg-red-950/40 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateShop}
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Oluşturuluyor..." : "Mağazayı Oluştur"}
          </button>
        </div>

        {createdShopId && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-xl font-bold mb-2">Mağaza Oluşturuldu 🎉</h2>
            <p className="text-sm text-slate-300 mb-2">
              Bu mağaza için oluşturulan <strong>Shop ID</strong>:
            </p>
            <div className="inline-flex items-center rounded-md bg-slate-800 px-3 py-1 text-sm font-mono">
              {createdShopId}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1 text-sm">
                1) Müşteri tarafı (Customer) embed kodu
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Mağaza sahibi bunu kendi e-ticaret web sitesine ekleyecek
                (müşterilerin gördüğü site).
              </p>
              <pre className="bg-black text-green-400 text-xs p-3 rounded-md overflow-x-auto">
{`<script 
  src="${WIDGET_URL}"
  data-shop-id="${createdShopId}"
  data-mode="customer">
</script>`}
              </pre>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1 text-sm">
                2) Yönetici tarafı (Admin) embed kodu
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Mağaza sahibi bunu kendi mağaza yönetim paneline ekleyecek
                (Shopier/Shopify admin alanına uygun bir yere).
              </p>
              <pre className="bg-black text-green-400 text-xs p-3 rounded-md overflow-x-auto">
{`<script 
  src="${WIDGET_URL}"
  data-shop-id="${createdShopId}"
  data-mode="admin">
</script>`}
              </pre>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Not: <span className="font-mono">YOUR_DOMAIN.com</span> kısmını,
              sistemi canlıya aldığında kendi domaininle değiştireceksin.
              Geliştirme ortamında istersen
              <span className="font-mono"> http://localhost:3000/chat-widget.js </span>
              gibi kullanabilirsin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
