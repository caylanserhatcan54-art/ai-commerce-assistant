import { firestore } from '@config/firebase';
import { productService } from '@modules/products/product.service';

export const webhookService = {
  async process(source: 'shopify' | 'trendyol' | 'shopier', payload: unknown) {
    const logRef = firestore.collection('webhook_logs').doc();
    await logRef.set({ source, payload, receivedAt: Date.now() });
    // Placeholder: parse payload and update collections
    if (source === 'shopify') {
      await productService.listProducts('shop-id-placeholder');
    }
    return { processed: true };
  }
};