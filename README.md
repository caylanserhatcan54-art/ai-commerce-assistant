diff --git a/README.md b/README.md
index 4f30c3290ede3908c51ec2a74e00a0fcdaf3b1ea..d3b05cb2dd965b4ed8ede74be641d3876e8c0899 100644
--- a/README.md
+++ b/README.md
@@ -1,21 +1,34 @@
-# Desenyum AI Kılıf Tasarım Asistanı Web Sitesi
+# AI E-Ticaret Asistan Platformu
 
-Bu proje, Sen Desenyum Case mağazası için özel olarak tasarlanmış yapay zekâ destekli telefon kılıfı tasarım asistanının tanıtım web sitesidir. Site; hizmetin öne çıkan özelliklerini, çalışma sürecini, örnek tasarım stillerini, paket seçeneklerini ve iletişim formunu içerir.
+Shopify, Shopier, Trendyol, Hepsiburada, İkas ve özel mağazalara tek satırlık kodla hem **Müşteri Asistanı** (storefront baloncuğu) hem **Satıcı Asistanı** (merchant panel baloncuğu) eklemek için modüler ve ölçeklenebilir bir SaaS iskeleti.
 
-## Özellikler
-- Anime, cartoon veya karikatür stilinde yüksek çözünürlüklü kılıf tasarımlarını vurgulayan modern bir tanıtım.
-- Duyarlı tasarım: Masaüstü, tablet ve mobil cihazlarda optimize edilmiş görünüm.
-- Form gönderimi sonrasında kullanıcı dostu bilgilendirme penceresi.
-- Navigasyon menüsü için mobil cihazlara uygun açılır menü.
-
-## Kurulum
-Statik bir site olduğu için projeyi yerel ortamınızda görüntülemek üzere tek yapmanız gereken dosyaları bir tarayıcıda açmaktır:
+## Monorepo Yapısı
+- `backend/`: Node.js + Express + TypeScript API (Firestore, Stripe/Iyzico, OAuth, webhooks, AI sağlayıcıları)
+- `admin/`: Next.js 14 App Router tabanlı yönetim paneli (üyelik, abonelik, API key, embed kodu, istatistikler)
+- `embed/assist.js`: Mağaza sitelerine eklenecek tek satırlık script; müşteri ve satıcı baloncuklarını aynı anda kurar.
 
+## Hızlı Başlangıç
 ```bash
-# Proje dizinine gidin ve ana dosyayı açın
-cd desktop-tutorial
-xdg-open index.html  # macOS için: open index.html, Windows için: start index.html
+# Backend
+cd backend
+npm install
+npm run dev
+
+# Admin panel
+cd admin
+npm install
+npm run dev
+```
+
+## Entegrasyon
+Mağaza sahibi panelden SHOP_ID ve API anahtarını aldıktan sonra mağaza sitesine şu kodu ekler:
+```html
+<script src="https://MYDOMAIN.com/assist.js" data-shop="SHOP_ID"></script>
 ```
 
-## Lisans
-Bu proje örnek bir çalışma olup, Desenyum AI marka kimliği ile birlikte kullanılmak üzere tasarlanmıştır.
+## Özellik Taslakları
+- SHOP_ID tabanlı çoklu mağaza mimarisi ve JWT korumalı API uçları
+- Shopify OAuth, Trendyol/Shopier veri çekme modülleri ve webhook dinleyicileri
+- Firestore koleksiyon şemaları: shops, products, orders, analytics, conversations, billing, webhook_logs
+- AI endpointleri (chat, öneri, analitik), yerel Ollama + OpenAI fallback mimarisi
+- Stripe/Iyzico abonelik sistemi ve kullanım token sayaçları için temel iskelet
