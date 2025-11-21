import Link from 'next/link';

const steps = [
  { title: 'Üyelik', description: 'Mağaza sahibi kayıt olur ve e-posta doğrulaması yapar.' },
  { title: 'Ödeme', description: 'Stripe/Iyzico üzerinden abonelik planını seçer.' },
  { title: 'API Key', description: 'Panelden tek tıkla API key ve SHOP_ID üretir.' },
  { title: 'Entegrasyon', description: '<script src="https://MYDOMAIN.com/assist.js" data-shop="SHOP_ID"></script> kodunu ekler.' }
];

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-semibold mb-2">AI E-Ticaret Asistan Platformu</h1>
        <p className="text-slate-700">Tek satırlık script ile hem müşteri hem satıcı asistanını entegre edin.</p>
        <div className="flex gap-3 mt-4">
          <Link className="px-4 py-2 bg-slate-900 text-white rounded" href="/dashboard">Dashboard</Link>
          <Link className="px-4 py-2 bg-white border rounded" href="/(auth)/login">Giriş Yap</Link>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-3">Kurulum Adımları</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {steps.map((step) => (
            <div key={step.title} className="border border-slate-100 rounded p-3">
              <div className="font-medium">{step.title}</div>
              <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: step.description }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}