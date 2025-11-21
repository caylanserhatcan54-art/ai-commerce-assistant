import axios from 'axios';

export class ShopifyClient {
  constructor(private shopDomain: string, private accessToken: string) {}

  private get client() {
    return axios.create({
      baseURL: `https://${this.shopDomain}/admin/api/2024-01`,
      headers: { 'X-Shopify-Access-Token': this.accessToken }
    });
  }

  async listProducts() {
    const { data } = await this.client.get('/products.json');
    return data.products;
  }

  async listOrders() {
    const { data } = await this.client.get('/orders.json');
    return data.orders;
  }
}