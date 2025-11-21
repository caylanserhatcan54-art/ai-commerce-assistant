export default function LoginPage() {
  return (
    <div className="card max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-2">Giriş Yap</h1>
      <p className="text-slate-600 mb-4">Demo login akışını burada başlatın.</p>
      <form className="space-y-3">
        <input className="w-full border rounded p-2" type="email" placeholder="E-posta" />
        <input className="w-full border rounded p-2" type="password" placeholder="Parola" />
        <button className="w-full bg-slate-900 text-white rounded p-2" type="submit">Devam Et</button>
      </form>
    </div>
  );
}