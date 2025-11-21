import crypto from "crypto";
import { Request, Response } from "express";

export const shopierController = {
  // 1) ÖDEME OLUŞTUR
  async createPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, email } = req.body;

      if (!orderId || !amount || !email) {
        return res.status(400).json({ error: "Eksik parametre" });
      }

      const data = {
        API_key: process.env.SHOPIER_API_KEY!,
        website_index: "1",
        platform: "API",
        order_id: orderId,
        buyer_email: email,
        payment_amount: amount,
        currency: "TRY",
      };

      // İmza oluştur
      const signature = crypto
        .createHmac("SHA256", process.env.SHOPIER_API_SECRET!)
        .update(
          `${data.API_key}${data.order_id}${data.payment_amount}${data.buyer_email}`
        )
        .digest("hex");

      const paymentUrl = `https://www.shopier.com/ShowProduct/api_pay4.php?${new URLSearchParams(
        data as any
      ).toString()}&signature=${signature}`;

      return res.json({
        ok: true,
        paymentUrl,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // 2) SHOPIER GERİ DÖNÜŞ (SUCCESS PAGE)
  async verifyPayment(req: Request, res: Response) {
    try {
      console.log("Shopier verify geldi:", req.body);

      return res.json({
        ok: true,
        message: "Ödeme doğrulandı (mock)",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // 3) WEBHOOK → SİPARİŞ TAMAMLANDI
  async webhookReceiver(req: Request, res: Response) {
    try {
      console.log("🔥 Shopier webhook geldi:", req.body);

      return res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
};
