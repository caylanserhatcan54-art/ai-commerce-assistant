// backend/src/routes/billing.ts

import { Router, Request, Response } from "express";
import { initializeCheckoutForm, retrieveCheckoutForm } from "../modules/payments/iyzico";
import { db } from "../config/firebase";

export const billingRouter = Router();

/**
 * Ödeme başlatma
 * Body:
 * {
 *   "shopId": "xxx",
 *   "email": "owner@example.com",
 *   "fullName": "Ad Soyad",
 *   "price": 99.90 (opsiyonel)
 * }
 */
billingRouter.post("/initialize", async (req: Request, res: Response) => {
  try {
    const { shopId, email, fullName, price } = req.body || {};

    if (!shopId || !email || !fullName) {
      return res.status(400).json({
        success: false,
        message: "shopId, email ve fullName zorunludur",
      });
    }

    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      undefined;

    const result = await initializeCheckoutForm({
      shopId,
      email,
      fullName,
      clientIp,
      price,
    });

    // Frontend bu html'i direkt render edecek
    return res.json({
      success: true,
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
      conversationId: result.conversationId,
    });
  } catch (err: any) {
    console.error("POST /api/billing/initialize ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Ödeme başlatılırken hata oluştu",
    });
  }
});

/**
 * iyzico callback
 * iyzico, ödeme bittikten sonra buraya POST ile `token` gönderir.
 * Biz de token ile sonucu sorgular, başarılıysa Firestore'da shop'u aktif ederiz.
 */
billingRouter.post("/callback", async (req: Request, res: Response) => {
  try {
    const { token } = req.body || {};

    if (!token) {
      console.error("iyzico callback: token yok");
      return res.status(400).send("Geçersiz istek");
    }

    const paymentResult = await retrieveCheckoutForm(token);

    // conversationId'den shopId'i çıkaralım: "shop-<shopId>-timestamp"
    const convId: string = paymentResult.conversationId || "";
    const match = convId.match(/^shop-(.+)-(\d+)$/);
    const shopId = match?.[1];

    console.log("iyzico paymentResult:", paymentResult);

    const paymentStatus =
      paymentResult.paymentStatus || paymentResult.status || "FAILURE";

    const isSuccess =
      paymentStatus.toUpperCase() === "SUCCESS" ||
      paymentStatus.toUpperCase() === "SUCCESSFUL" ||
      paymentResult.status === "success";

    if (!shopId) {
      console.error("iyzico callback: shopId bulunamadı. conversationId:", convId);
    }

    if (isSuccess && shopId) {
      const amount = Number(paymentResult.paidPrice || paymentResult.price || 0);

      await db.collection("shops").doc(shopId).set(
        {
          billing: {
            status: "active",
            provider: "iyzico",
            lastPaymentAt: new Date().toISOString(),
            lastPaymentId: paymentResult.paymentId || null,
            lastToken: token,
            lastConversationId: convId,
            lastAmount: amount,
          },
        },
        { merge: true }
      );

      console.log(`Shop ${shopId} iyzico ödemesi başarılı, aktif edildi.`);
    } else {
      console.warn("iyzico ödeme başarısız:", paymentStatus, convId);
    }

    // Kullanıcıya basit bir sayfa döndürelim
    if (isSuccess) {
      return res.send(`
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: Arial; text-align: center; padding-top: 60px;">
            <h2>Ödemeniz başarıyla alındı ✅</h2>
            <p>Artık AI Shop Assistant'ı mağazanızda kullanabilirsiniz.</p>
            <p>Bu pencereyi kapatıp panelinize geri dönebilirsiniz.</p>
          </body>
        </html>
      `);
    } else {
      return res.send(`
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: Arial; text-align: center; padding-top: 60px;">
            <h2>Ödeme sırasında bir sorun oluştu ❌</h2>
            <p>Lütfen tekrar deneyin veya bizimle iletişime geçin.</p>
          </body>
        </html>
      `);
    }
  } catch (err: any) {
    console.error("POST /api/billing/callback ERROR:", err);
    return res.status(500).send("Sunucu hatası");
  }
});
