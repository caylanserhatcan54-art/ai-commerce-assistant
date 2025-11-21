import crypto from "crypto";
import axios from "axios";

export class ShopierClient {
  private apiKey: string;
  private apiSecret: string;
  private merchantId: string;

  constructor() {
    this.apiKey = process.env.SHOPIER_API_KEY!;
    this.apiSecret = process.env.SHOPIER_API_SECRET!;
    this.merchantId = process.env.SHOPIER_MERCHANT_ID!;
  }

  // 🔐 İmzalama işlemi
  private sign(payload: any) {
    const json = JSON.stringify(payload);
    return crypto.createHmac("sha256", this.apiSecret).update(json).digest("hex");
  }

  // 🔥 API'ye istek gönder
  private async request(action: string, extra: any = {}) {
    const payload = {
      merchant_id: this.merchantId,
      action,
      timestamp: Date.now(),
      ...extra,
    };

    const signature = this.sign(payload);

    const response = await axios.post(
      "https://www.shopier.com/api/v1/",
      {
        ...payload,
        api_key: this.apiKey,
        signature,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  }

  // 🟦 Ürünleri getir
  async listProducts() {
    return this.request("list_products");
  }

  // 🟥 Siparişleri getir
  async listOrders() {
    return this.request("list_orders");
  }

  // 🟩 Tek ürün
  async getProduct(productId: string) {
    return this.request("get_product", { product_id: productId });
  }
}
