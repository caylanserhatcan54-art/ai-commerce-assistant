import { Router } from "express";
import admin from "firebase-admin";
import { getShopSettings } from "../modules/shops/settings.service";
import { getShopProducts } from "../modules/shops/products.service";

export const shopRouter = Router();

/* =====================================================
   0) SHOP LİSTELE — GET /api/shops/list?owner=email
===================================================== */
shopRouter.get("/list", async (req, res) => {
  try {
    const { owner } = req.query;

    if (!owner) {
      return res.json({
        success: false,
        error: "owner parametresi zorunludur (email)",
      });
    }

    const snap = await admin
      .firestore()
      .collection("shops")
      .where("owner", "==", owner)
      .get();

    const shops = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return res.json({
      success: true,
      shops,
    });
  } catch (err: any) {
    console.error("❌ SHOP LIST ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* =====================================================
   1) SHOP OLUŞTUR — POST /api/shops/create
===================================================== */
shopRouter.post("/create", async (req, res) => {
  try {
    const { shopId, name, shopierId, widgetColor, logoUrl, owner } = req.body;

    if (!shopId || !name || !owner) {
      return res.status(400).json({
        success: false,
        error: "shopId, name ve owner zorunludur",
      });
    }

    await admin.firestore().collection("shops").doc(shopId).set({
      name,
      owner,                 // ← kullanıcı email'i (dashboard için gerekli)
      shopierId: shopierId || "",
      widgetColor: widgetColor || "#4a69ff",
      logoUrl: logoUrl || "",
      createdAt: Date.now(),
      billing: {
        status: "inactive", // ödeme yapılana kadar pasif
      },
    });

    return res.json({
      success: true,
      message: "Mağaza başarıyla oluşturuldu",
      shopId,
    });
  } catch (err: any) {
    console.error("❌ SHOP CREATE ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* =====================================================
   2) SHOP AYARLARI — GET /api/shops/:shopId/settings
===================================================== */
shopRouter.get("/:shopId/settings", async (req, res) => {
  try {
    const { shopId } = req.params;

    const settings = await getShopSettings(shopId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: "Mağaza bulunamadı",
      });
    }

    return res.json({
      success: true,
      shopId,
      ...settings,
    });
  } catch (err: any) {
    console.error("❌ SHOP SETTINGS ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* =====================================================
   3) ÜRÜNLERİ GETİR — GET /api/shops/:shopId/products
===================================================== */
shopRouter.get("/:shopId/products", async (req, res) => {
  try {
    const { shopId } = req.params;

    const products = await getShopProducts(shopId);

    return res.json({
      success: true,
      shopId,
      products,
    });
  } catch (err: any) {
    console.error("❌ SHOP PRODUCTS ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* =====================================================
   4) ÜRÜN EKLE — POST /api/shops/:shopId/products/add
===================================================== */
shopRouter.post("/:shopId/products/add", async (req, res) => {
  try {
    const { shopId } = req.params;
    const { title, price, tags, image } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        error: "title ve price zorunludur",
      });
    }

    const productId = admin.firestore().collection("_").doc().id;

    function slugify(text: string) {
      return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i")
        .replace(/İ/g, "i")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "g")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "c")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "u")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    const shopSnap = await admin
      .firestore()
      .collection("shops")
      .doc(shopId)
      .get();

    if (!shopSnap.exists) {
      return res.json({ success: false, error: "Mağaza bulunamadı" });
    }

    const shopData = shopSnap.data();
    const shopierId = shopData?.shopierId || null;

    let link = "";
    if (shopierId) {
      link = `https://shopier.com/${shopierId}/${slugify(title)}`;
    }

    await admin
      .firestore()
      .collection("shops")
      .doc(shopId)
      .collection("products")
      .doc(productId)
      .set({
        id: productId,
        title,
        price,
        tags: tags || [],
        image: image || "",
        link,
        createdAt: Date.now(),
      });

    return res.json({
      success: true,
      message: "Ürün başarıyla eklendi",
      productId,
    });
  } catch (err: any) {
    console.error("❌ PRODUCT ADD ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* =====================================================
   5) LİSANS KONTROLÜ — GET /api/shops/:shopId/license
===================================================== */
shopRouter.get("/:shopId/license", async (req, res) => {
  try {
    const { shopId } = req.params;

    const doc = await admin.firestore().collection("shops").doc(shopId).get();

    if (!doc.exists) {
      return res.json({
        success: false,
        error: "Mağaza bulunamadı",
      });
    }

    const data = doc.data() || {};

    return res.json({
      success: true,
      shopId,
      status: data.billing?.status || "inactive",
      billing: data.billing || null,
    });
  } catch (err: any) {
    console.error("❌ LICENSE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
