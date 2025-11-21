(function () {
  const shopId = document.currentScript?.dataset?.shop || 'demo-shop';
  const apiBase = 'https://MYDOMAIN.com/api';

  function createBubble({ id, title, description, position = 'bottom-right' }) {
    const container = document.createElement('div');
    container.id = id;
    container.style.position = 'fixed';
    container.style[position.includes('right') ? 'right' : 'left'] = '16px';
    container.style.bottom = position.includes('bottom') ? '16px' : 'unset';
    container.style.top = position.includes('top') ? '16px' : 'unset';
    container.style.width = '320px';
    container.style.fontFamily = 'Inter, system-ui, sans-serif';
    container.style.zIndex = 9999;

    container.innerHTML = `
      <div style="background: #0f172a; color: #fff; border-radius: 14px 14px 6px 6px; padding: 12px 14px; box-shadow: 0 10px 40px rgba(0,0,0,0.18);">
        <div style="font-weight: 600; font-size: 15px;">${title}</div>
        <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">${description}</div>
      </div>
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; padding: 10px 12px;">
        <div style="display: flex; gap: 8px;">
          <input aria-label="Mesaj" style="flex:1; border: 1px solid #cbd5e1; border-radius: 10px; padding: 8px 10px;" placeholder="Sorunuzu yazın" />
          <button style="background:#0f172a; color:#fff; border:none; border-radius:10px; padding:8px 12px; cursor:pointer;">Gönder</button>
        </div>
      </div>`;

    return container;
  }

  function mountBubbles() {
    const customerBubble = createBubble({
      id: 'customer-assistant',
      title: 'Müşteri Asistanı',
      description: 'Ürün önerisi, kombin ve stok bilgisi alın.'
    });

    const merchantBubble = createBubble({
      id: 'merchant-assistant',
      title: 'Satıcı Asistanı',
      description: 'İçgörüler, fiyat önerisi ve stok uyarıları.',
      position: 'bottom-left'
    });

    document.body.appendChild(customerBubble);
    document.body.appendChild(merchantBubble);
  }

  function boot() {
    mountBubbles();
    console.log('[assist.js] initialized', { shopId, apiBase });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();