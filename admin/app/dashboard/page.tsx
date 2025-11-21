// admin/app/dashboard/page.tsx

const SHOP_ID = "DEMO_SHOP_123"; // Şimdilik demo, sonra backend'den gelecek

export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const embedUrl =
    process.env.NEXT_PUBLIC_EMBED_URL || `${apiUrl.replace(/\/$/, "")}/embed/assist.js`;

  const embedCode = `<script src="${embedUrl}" data-shop="${SHOP_ID}"></script>`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">AI E-Ticaret Asistanı Dashboard</h1>
          <p className="text-slate-300">
            SHOP_ID tabanlı AI asistanınızı mağazanıza entegre etmek için aşağıdaki adımları izleyin.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold mb-2">Mağaza Bilgisi</h2>
            <p className="text-sm text-slate-300 mb-1">
              <span className="font-medium">SHOP_ID:</span> {SHOP_ID}
            </p>
            <p className="text-sm text-slate-400">
              Şimdilik demo SHOP_ID kullanıyoruz. Sonraki adımda bunu backend&apos;den
              gerçek mağaza kaydına göre çekeceğiz.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold mb-2">API Adresi</h2>
            <p className="text-sm text-slate-300 mb-1">
              <span className="font-medium">API URL:</span> {apiUrl}
            </p>
            <p className="text-sm text-slate-300 mb-1">
              <span className="font-medium">Embed JS:</span> {embedUrl}
            </p>
            <p className="text-xs text-slate-500">
              Canlı ortama geçtiğimizde bu URL&apos;ler kendi domainine göre güncellenecek.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <h2 className="text-lg font-semibold">4. Adım — Entegrasyon Kodu</h2>
          <p className="text-sm text-slate-300">
            Mağaza temasına aşağıdaki script etiketini ekleyin. Hepsi bu. AI müşteri
            ve satıcı asistanı sağ altta baloncuk olarak görünecek.
          </p>

          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-100 overflow-x-auto">
            {embedCode}
          </div>

          <p className="text-xs text-slate-500">
            Gerçek sistemde SHOP_ID ve API key, bu panelde mağaza kaydınızdan otomatik
            üretilecek ve buraya yazılacak.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
          <h2 className="text-lg font-semibold">Kurulum Özeti</h2>
          <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
            <li>Bu panele üye ol ve mağazanı kaydet.</li>
            <li>Abonelik/ödeme adımını tamamla.</li>
            <li>SHOP_ID ve API key oluştur.</li>
            <li>
              Yukarıdaki script etiketini Shopify / Shopier / Trendyol / İkas tema
              koduna ekle.
            </li>
            <li>AI E-Ticaret Asistanı hem müşterilere hem satıcıya hizmet vermeye başlasın.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
