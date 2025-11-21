import { Router } from "express";
import admin from "firebase-admin";

export const productsRouter = Router();

// Ürün ekleme
productsRouter.post("/:shopId/add", async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const product = req.body;

    if (!shopId || !product.title) {
      return res.status(400).json({ error: "Eksik veri" });
    }

    const ref = admin
      .firestore()
      .collection("shops")
      .doc(shopId)
      .collection("products")
      .doc();

    const data = {
      id: ref.id,
      ...product,
      createdAt: Date.now(),
    };

    await ref.set(data);

    res.json({ success: true, product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
