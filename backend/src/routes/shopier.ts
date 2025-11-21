import express from "express";
import { shopierController } from "../modules/integrations/shopier/controller.ts";

const router = express.Router();

// Ödeme linki oluşturma
router.post("/pay", shopierController.createPayment);

// Shopier geri dönüş doğrulama
router.post("/verify", shopierController.verifyPayment);

// Sipariş tamamlandığında webhook
router.post("/webhook", shopierController.webhookReceiver);

export const shopierRouter = router;
