export const askAssistant = async ({ role, message, context }: any) => {
  const model =
    role === "admin"
      ? "qwen2.5:14b"  // mağaza sahibi strateji modeli
      : "qwen2.5:7b";   // müşteri tezgahtar modeli

  const systemPrompt =
    role === "admin"
      ? "Sen bir e-ticaret danışmanı yapay zekasın. Mağaza sahibine fiyat önerisi, ürün analizi, kampanya stratejileri ve satış artırma önerileri sunacaksın. Kısa ama doğru konuş."
      : "Sen bir mağaza asistanısın. Müşteriyle konuşur gibi samimi, anlaşılır ve satış odaklı cevaplar ver. İkna edici ol ama kaba olma.";

  const body = {
    model,
    prompt: `${systemPrompt}\n\nKullanıcı mesajı:\n${message}\n\nMağaza bağlamı:\n${JSON.stringify(
      context || {},
      null,
      2
    )}`,
    stream: false,
  };

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data.response || "";
};
