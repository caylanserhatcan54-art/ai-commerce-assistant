"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-8 py-6 border-b border-slate-800">
        <div className="text-2xl font-bold">AI Shop Assistant</div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-blue-400">Özellikler</a>
          <a href="#pricing" className="hover:text-blue-400">Fiyatlandırma</a>
          <a href="#demo" className="hover:text-blue-400">Demo</a>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
          >
            Giriş Yap
          </button>
        </nav>
      </header>

      {/* HERO AREA */}
      <section className="px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Mağazan İçin <span className="text-blue-500">Yapay Zeka</span>  
          <br />  
          <span className="text-slate-300">24/7 Satış Asistanı</span>
        </h1>

        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-10">
          Shopier, Shopify ve tüm web sitelerine tek satır kodla entegre edilen  
          <strong className="text-white"> AI destekli satış ve yönetim asistanı.</strong>  
          Hem müşteriye satış yapar hem mağaza sahibine öneriler sunar.
        </p>

        <button
          onClick={() => router.push("/register")}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl text-lg font-semibold"
        >
          Ücretsiz Başla →
        </button>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-8 py-20 text-center border-t border-slate-800">
        <h2 className="text-3xl font-bold mb-6">Canlı Demo</h2>

        <div className="mx-auto w-full max-w-xl bg-slate-900 rounded-xl border border-slate-800 p-6">
          <img
            src="https://i.imgur.com/cHcH1P8.gif"
            className="w-full rounded-lg"
            alt="AI Assistant Demo"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-20 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Müşteri Asistanı</h3>
            <p className="text-slate-400 text-sm">
              Müşterilere ürün önerir, kampanya anlatır, ikna eder,  
              ürün detaylarını açıklayarak satışa dönüştürür.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Mağaza Yönetim Asistanı</h3>
            <p className="text-slate-400 text-sm">
              Mağaza sahibine fiyat önerisi, rakip analizi, strateji ve  
              satış artırma önerileri sunar.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-bold mb-3 text-blue-400">Tek Satır Kodla Kurulum</h3>
            <p className="text-slate-400 text-sm">
              Shopier, Shopify veya herhangi bir web sitesine sadece  
              <strong>1 satır script</strong> ile eklenir.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-8 py-20 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12">Fiyatlandırma</h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
            <h3 className="text-xl font-bold mb-4">Starter</h3>
            <p className="text-blue-400 text-4xl font-extrabold mb-4">₺149</p>
            <p className="text-slate-400 text-sm mb-6">Aylık abonelik</p>
            <ul className="text-slate-300 text-sm mb-6 space-y-2">
              <li>✔ Müşteri AI Asistanı</li>
              <li>✔ Admin Yönetim Asistanı</li>
              <li>✔ Sınırsız Mesaj</li>
              <li>✔ Tek mağaza</li>
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="bg-blue-600 hover:bg-blue-500 w-full py-3 rounded-lg font-semibold"
            >
              Başla →
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-xl border border-blue-600 text-center scale-105">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Pro</h3>
            <p className="text-blue-400 text-4xl font-extrabold mb-4">₺299</p>
            <p className="text-slate-400 text-sm mb-6">Aylık abonelik</p>
            <ul className="text-slate-300 text-sm mb-6 space-y-2">
              <li>✔ 3 mağaza</li>
              <li>✔ AI Ürün Analizi</li>
              <li>✔ Premium Prompt Setleri</li>
              <li>✔ Öncelikli Destek</li>
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="bg-blue-600 hover:bg-blue-500 w-full py-3 rounded-lg font-semibold"
            >
              En Çok Tercih Edilen →
            </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
            <h3 className="text-xl font-bold mb-4">Enterprise</h3>
            <p className="text-blue-400 text-4xl font-extrabold mb-4">₺599</p>
            <p className="text-slate-400 text-sm mb-6">Aylık abonelik</p>
            <ul className="text-slate-300 text-sm mb-6 space-y-2">
              <li>✔ Sınırsız mağaza</li>
              <li>✔ Gelişmiş Raporlama</li>
              <li>✔ Özel AI Promptları</li>
              <li>✔ Özel Eğitimli Model</li>
            </ul>

            <button
              onClick={() => router.push("/register")}
              className="bg-blue-600 hover:bg-blue-500 w-full py-3 rounded-lg font-semibold"
            >
              Satış Ekibimizle Görüş →
            </button>
          </div>

        </div>
      </section>

      <footer className="py-10 text-center text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} AI Shop Assistant — Tüm Hakları Saklıdır.
      </footer>
    </div>
  );
}
