import { firestore } from '@config/firebase';
import { Product } from './product.model';

export const productService = {
  async listProducts(shopId: string): Promise<Product[]> {
    const snapshot = await firestore.collection('products').where('shopId', '==', shopId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Product) }));
  },

  async getProductContext(shopId: string) {
    const products = await this.listProducts(shopId);
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      tags: product.tags,
      inventory: product.inventory
    }));
  }
};