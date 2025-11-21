"use client";

import { useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function CheckoutPage() {
  const [shopId, setShopId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [resultHTML, setResultHTML] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setError(null);
    setResultHTML(null);

    if (!shopId.trim() || !email.trim() || !fullName.trim()) {
      setError("Mağaza ID, email ve ad soyad zorunludur.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/billing/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          email,
          fullName,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Ödeme başlatılamadı.");
      } else {
        setResultHTML(data.checkoutFormContent);
      }
    } catch (err: any) {
      setError(err.message || "Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-xl px-4 py-14">
        <h1 className="text-3xl font-bold mb-6">AI Shop Assistant • Ödeme</h1>

        {!resultHTML && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <p className="text-sm text-slate-300 mb-2">
              Aşağıya bilgileri gir → iyzico ödeme ekranı otomatik açılacak.
            </p>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Shop ID
              </label>
              <input
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
                placeholder="Örn: SHOP-ABC123"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Email
              </label>
              <input
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Ad Soyad
              </label>
              <input
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
                placeholder="Ad Soyad"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md p-3">
                {error}
              </div>
            )}

            <button
              onClick={startPayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md py-2 mt-2 disabled:opacity-60"
            >
              {loading ? "Yükleniyor..." : "Ödeme Başlat"}
            </button>
          </div>
        )}

        {/* iyzico HTML checkout form burada render edilir */}
        {resultHTML && (
          <div className="mt-10 bg-white p-4 rounded-xl text-black">
            <div
              dangerouslySetInnerHTML={{ __html: resultHTML }}
            />
            <div id="iyzipay-checkout-form" className="responsive" />
          </div>
        )}
      </div>
    </div>
  );
}
