import { Router } from "express";
import { askAssistant } from "../modules/ai/chat.service";
import { getShopSettings } from "../modules/shops/settings.service";
import { getShopProducts } from "../modules/shops/products.service";

export const aiRouter = Router();

/* =====================================================
      MÜŞTERİ ASİSTANI  (Customer AI)
===================================================== */
aiRouter.post("/customer", async (req, res) => {
  try {
    const { message, shopId } = req.body;

    if (!message || !shopId) {
      return res.status(400).json({
        success: false,
        error: "message ve shopId gerekiyor",
      });
    }

    // Mağaza ayarlarını al
    const settings = await getShopSettings(shopId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: "Mağaza bulunamadı",
      });
    }

    // Mağazanın ürünlerini al
    const products = await getShopProducts(shopId);

    // AI Asistanı çağır
    const answer = await askAssistant({
      role: "customer",
      message,
      context: {
        settings,
        products,
      },
    });

    return res.json({
      success: true,
      role: "customer",
      answer,
    });

  } catch (err: any) {
    console.error("❌ AI CUSTOMER ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


/* =====================================================
      MAĞAZA SAHİBİ ASİSTANI  (Admin AI)
===================================================== */
aiRouter.post("/admin", async (req, res) => {
  try {
    const { message, shopId } = req.body;

    if (!message || !shopId) {
      return res.status(400).json({
        success: false,
        error: "message ve shopId gerekiyor",
      });
    }

    // Mağaza ayarlarını al
    const settings = await getShopSettings(shopId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: "Mağaza bulunamadı",
      });
    }

    // Mağazanın ürünlerini al
    const products = await getShopProducts(shopId);

    // AI Asistanını çağır
    const answer = await askAssistant({
      role: "admin",
      message,
      context: {
        settings,
        products,
      },
    });

    return res.json({
      success: true,
      role: "admin",
      answer,
    });

  } catch (err: any) {
    console.error("❌ AI ADMIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
