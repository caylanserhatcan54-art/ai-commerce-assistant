import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 text-slate-900">
        <header className="p-4 border-b bg-white shadow-sm">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div className="text-lg font-semibold">AI E-Ticaret Asistanı</div>
            <div className="text-sm text-slate-600">SHOP_ID tabanlı yönetim</div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}