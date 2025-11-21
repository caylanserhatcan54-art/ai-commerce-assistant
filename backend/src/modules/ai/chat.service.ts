import axios from "axios";

// Ollama API endpoint
const OLLAMA_URL = "http://localhost:11434/api/generate";

/* =====================================================
    CUSTOMER PROMPT (Müşteri asistanı)
===================================================== */
function buildCustomerPrompt(message: string, context: any) {
  const { settings, products } = context;

  return `
Sen bir e-ticaret mağazası için çalışan profesyonel bir satış temsilcisisin.
Görevin: kullanıcının isteğini anlamak, ona doğru ürünü bulmak,
ikna edici bir dille öneriler sunmak ve gerektiğinde kampanya/avantaj anlatmak.

Mağaza adı: ${settings.name || "Mağaza"}
Shopier ID: ${settings.shopierId}
Widget rengi: ${settings.widgetColor}

ÜRÜN LİSTESİ:
${products
  .map(
    (p: any) => `
Ürün Adı: ${p.title}
Fiyat: ${p.price} TL
Etiketler: ${p.tags?.join(", ")}
`
  )
  .join("\n")}

Kurallar:
- Çok net, kısa, akıcı ve Türkçe konuş.
- Ürün ismi geçtiğinde kullanıcıya uygun bir öneri sun.
- Gereksiz bilgi verme.
- Kullanıcı özellikle sormadıkça mağazadan bahsetme.
- Asla "Bağlamdan çıkma" gibi cümleler kullanma.
- Ürünlerin fiyatlarını kullanabilirsin.
- Satışa yönelik sıcak ve yardımcı bir ton kullan.

KULLANICI MESAJI:
"${message}"

Cevabın:
`;
}

/* =====================================================
    ADMIN PROMPT (Mağaza sahibi asistanı)
===================================================== */
function buildAdminPrompt(message: string, context: any) {
  const { settings, products } = context;

  return `
Sen bir e-ticaret işletme danışmanı ve yapay zeka pazarlama uzmanısın.
Karşında mağaza sahibi var. Ona:
- ürün satış stratejisi,
- fiyatlandırma tavsiyeleri,
- Shopier/Shopify mağaza optimizasyonu,
- ürün açıklaması geliştirme,
- rakip fiyat analizi (genel, tahmini),
- kampanya ve dönüşüm artırma fikirleri
vermelsin.

Mağaza adı: ${settings.name}
Shopier ID: ${settings.shopierId}

Mağaza ürünleri:
${products
  .map(
    (p: any) => `
${p.title} — ${p.price} TL — Etiketler: ${p.tags?.join(", ")}
`
  )
  .join("\n")}

KULLANICI (MAĞAZA SAHİBİ) MESAJI:
"${message}"

Kurallar:
- Sadece mağaza sahibine konuşuyorsun.
- Müşteriye yönelik konuşma.
- Tavsiyelerin gerçek hayatta uygulanabilir ve net olsun.
- Türkiye e-ticaret pazarına uygun konuş.
- Ürünleri geliştirirken net örnek ver.
- Fiyat önerirken aralık öner (örn: 249–279 TL mantıklı).
- Çok uzun açıklama verme, direkt öneri ver.

Cevabın:
`;
}

/* =====================================================
    OLLAMA'YA İSTEK ATAN ANA FONKSİYON
===================================================== */
export async function askAssistant({
  role,
  message,
  context,
}: {
  role: "customer" | "admin";
  message: string;
  context: any;
}) {
  try {
    const prompt =
      role === "customer"
        ? buildCustomerPrompt(message, context)
        : buildAdminPrompt(message, context);

    const response = await axios.post(OLLAMA_URL, {
      model: "qwen2.5:7b-instruct",
      prompt,
      stream: false,
    });

    return response.data?.response || "";
  } catch (err: any) {
    console.error("❌ AI ERROR:", err.message);
    return "Şu anda yoğunluk var, tekrar dener misiniz?";
  }
}
