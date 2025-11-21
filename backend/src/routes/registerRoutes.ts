import { Application } from "express";

// Route files
import { aiRouter } from "./ai";
import { shopRouter } from "./shops";
import { webhookRouter } from "./webhooks";
import { shopifyRouter } from "./shopify";
import { shopierRouter } from "./shopier";

export const registerRoutes = (app: Application) => {
  // AI Assistant Routes
  app.use("/api/ai", aiRouter);

  // Shops (Shop Registration / Settings)
  app.use("/api/shops", shopRouter);

  // Webhooks
  app.use("/api/webhooks", webhookRouter);

  // Shopify OAuth Routes
  app.use("/shopify", shopifyRouter);

  // Shopier Integration Routes
  app.use("/api/shopier", shopierRouter);

  // Default
  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "AI Commerce Backend Running" });
  });
};
