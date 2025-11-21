"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = "http://localhost:4000/api";

export default function AddProductPage({ params }: { params: { shopId: string } }) {
  const router = useRouter();
  const shopId = params.shopId;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function addProduct() {
    setError(null);

    if (!title || !price) {
      setError("Başlık ve fiyat zorunlu.");
      return;
    }

    const res = await fetch(`${API_BASE}/shops/${shopId}/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
        tags: tags.split(",").map((t) => t.trim()),
        image,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Ürün eklenemedi.");
      return;
    }

    router.push(`/shops/${shopId}/products`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-xl px-4 py-14">
        <h1 className="text-3xl font-bold mb-6">Yeni Ürün Ekle</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">

          <div>
            <label className="block text-sm mb-1">Ürün Başlığı</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ör: iPhone Kılıf"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Fiyat (TL)</label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="129.90"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Etiketler (virgülle)</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="kılıf, iphone, desen"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Ürün Görseli (URL)</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://resim-url.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-400">{error}</div>
          )}

          <button
            onClick={addProduct}
            className="w-full bg-green-600 hover:bg-green-500 text-sm font-semibold rounded-md py-2"
          >
            Ürünü Ekle
          </button>

          <button
            onClick={() => router.push(`/shops/${shopId}/products`)}
            className="w-full bg-slate-700 text-sm rounded-md py-2 mt-2"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
