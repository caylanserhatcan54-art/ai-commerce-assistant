"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:4000/api";

export default function ProductsPage({ params }: { params: { shopId: string } }) {
  const router = useRouter();
  const shopId = params.shopId;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API_BASE}/shops/${shopId}/products`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      <div className="w-full max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-bold mb-6">
          Ürünler • {shopId}
        </h1>

        <button
          onClick={() => router.push(`/shops/${shopId}/products/add`)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 text-sm mb-6"
        >
          Yeni Ürün Ekle
        </button>

        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4"
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-20 h-20 rounded-md object-cover border border-slate-700"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-800 rounded-md flex items-center justify-center text-slate-500">
                  img
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-slate-400 text-sm mb-1">{p.price} TL</p>

                <a
                  href={p.link}
                  target="_blank"
                  className="text-blue-400 text-xs underline"
                >
                  Shopier Linki
                </a>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p className="text-slate-400 text-center mt-6">
              Henüz ürün yok. Ekleme yapabilirsin!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
