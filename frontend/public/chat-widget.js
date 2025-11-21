(function () {
  // Script Attributes
  const shopId = document.currentScript.getAttribute("data-shop-id");
  const mode = document.currentScript.getAttribute("data-mode") || "customer";

  if (!shopId) {
    console.error("Chat Widget Error: data-shop-id bulunamadı");
    return;
  }

  const API_BASE = "http://localhost:4000/api";

  // Widget Styles
  const style = document.createElement("style");
  style.innerHTML = `
    .ai-chat-bubble {
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: #4a69ff;
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 28px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      z-index: 999999;
      transition: all 0.25s ease;
    }
    .ai-chat-bubble:hover {
      transform: scale(1.07);
      background: #637dff;
    }

    .ai-chat-window {
      position: fixed;
      bottom: 100px;
      right: 25px;
      width: 330px;
      height: 420px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      animation: uiPop 0.25s ease;
    }

    @keyframes uiPop {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .ai-chat-header {
      background: #4a69ff;
      padding: 14px;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }

    .ai-chat-messages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      background: #f6f7fb;
    }

    .ai-chat-message {
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.4;
      max-width: 85%;
      white-space: pre-wrap;
    }

    .ai-chat-message.user {
      background: #dfe4ff;
      margin-left: auto;
    }

    .ai-chat-message.bot {
      background: #efefef;
    }

    .ai-chat-input-area {
      padding: 10px;
      border-top: 1px solid #ddd;
      background: white;
      display: flex;
      gap: 8px;
    }

    .ai-chat-input {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    .ai-chat-send-btn {
      background: #4a69ff;
      color: white;
      border: none;
      padding: 0 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.2s;
    }
    .ai-chat-send-btn:hover {
      background: #637dff;
    }
  `;
  document.head.appendChild(style);

  // Create Chat Bubble
  const bubble = document.createElement("div");
  bubble.className = "ai-chat-bubble";
  bubble.innerHTML = "💬";
  document.body.appendChild(bubble);

  // Chat Window
  let chatWindow = null;

  bubble.addEventListener("click", () => {
    if (chatWindow) {
      chatWindow.remove();
      chatWindow = null;
      return;
    }
    openChatWindow();
  });

  function openChatWindow() {
    chatWindow = document.createElement("div");
    chatWindow.className = "ai-chat-window";

    chatWindow.innerHTML = `
      <div class="ai-chat-header">
        ${mode === "admin" ? "Mağaza Yönetim Asistanı" : "AI Müşteri Asistanı"}
      </div>

      <div class="ai-chat-messages"></div>

      <div class="ai-chat-input-area">
        <input type="text" class="ai-chat-input" placeholder="Mesaj yaz..." />
        <button class="ai-chat-send-btn">Gönder</button>
      </div>
    `;

    document.body.appendChild(chatWindow);

    const messagesEl = chatWindow.querySelector(".ai-chat-messages");
    const inputEl = chatWindow.querySelector(".ai-chat-input");
    const sendBtn = chatWindow.querySelector(".ai-chat-send-btn");

    sendBtn.addEventListener("click", () => sendMessage(inputEl, messagesEl));
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage(inputEl, messagesEl);
    });
  }

  function appendMessage(text, sender, messagesEl) {
    const div = document.createElement("div");
    div.className = "ai-chat-message " + (sender === "user" ? "user" : "bot");
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(inputEl, messagesEl) {
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage(text, "user", messagesEl);
    inputEl.value = "";

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          role: mode === "admin" ? "admin" : "customer",
          message: text,
        }),
      });

      const data = await res.json();

      if (data.success) {
        appendMessage(data.answer, "bot", messagesEl);
      } else {
        appendMessage("Hata oluştu.", "bot", messagesEl);
      }
    } catch (err) {
      appendMessage("Bağlantı hatası.", "bot", messagesEl);
    }
  }
})();
