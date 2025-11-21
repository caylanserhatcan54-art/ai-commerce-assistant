"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:4000/api";
const WIDGET_URL = "https://YOUR_DOMAIN.com/chat-widget.js"; // prod’da domain eklenecek

export default function EmbedPage({ params }: { params: { shopId: string } }) {
  const router = useRouter();
  const shopId = params.shopId;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "active" | "inactive">(
    "loading"
  );
  const [billingInfo, setBillingInfo] = useState<any>(null);

  useEffect(() => {
    async function checkLicense() {
      try {
        const res = await fetch(`${API_BASE}/shops/${shopId}/license`);
        const data = await res.json();

        if (!data.success) {
          setStatus("inactive");
        } else {
          setStatus(data.status === "active" ? "active" : "inactive");
          setBillingInfo(data.billing);
        }
      } catch (err) {
        setStatus("inactive");
      } finally {
        setLoading(false);
      }
    }

    checkLicense();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  // ❌ Eğer ödeme yapılmamışsa embed kodunu gösterme
  if (status === "inactive") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex justify-center">
        <div className="w-full max-w-xl px-4 py-14 text-center">
          <h1 className="text-3xl font-bold mb-4">Embed Koduna Erişim Kapalı</h1>
          <p className="text-slate-300 mb-6">
            Bu mağaza için henüz abonelik ödemesi yapılmamış.  
            Embed kodunu görebilmek için ödeme yapmalısınız.
          </p>

          <button
            onClick={() =>
              router.push(`/checkout?shopId=${shopId}`)
            }
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold"
          >
            Ödeme Yap ve Aktifleştir
          </button>
        </div>
      </div>
    );
  }

  // ✔ ÖDEME YAPILDI → embed kodlarını göster
  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-2xl px-4 py-12">

        <h1 className="text-3xl font-bold mb-6">Embed Kodları • {shopId}</h1>

        <p className="text-sm text-slate-400 mb-4">
          Aşağıdaki script kodunu kendi web sitenize ekleyerek AI Shop Assistant’ı aktif hale getirebilirsiniz.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">

          <div>
            <h3 className="font-semibold mb-2 text-sm">Müşteri Tarafı (Customer)</h3>
            <pre className="text-green-400 text-xs bg-black p-3 rounded-md overflow-x-auto">
{`<script 
  src="${WIDGET_URL}"
  data-shop-id="${shopId}"
  data-mode="customer">
</script>`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm">Yönetici Tarafı (Admin)</h3>
            <pre className="text-green-400 text-xs bg-black p-3 rounded-md overflow-x-auto">
{`<script 
  src="${WIDGET_URL}"
  data-shop-id="${shopId}"
  data-mode="admin">
</script>`}
            </pre>
          </div>

          <p className="text-xs text-slate-400">
            Not: <strong>YOUR_DOMAIN.com</strong> kısmını gerçek domaininiz ile değiştireceksiniz.
          </p>
        </div>

      </div>
    </div>
  );
}
