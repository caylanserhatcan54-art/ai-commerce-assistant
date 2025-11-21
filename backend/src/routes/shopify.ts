import express from "express";
import { shopifyOauth } from "../modules/integrations/shopify/oauth";

const router = express.Router();

// Shopify App yükleme (OAuth install)
router.get("/oauth/start", shopifyOauth.install);

// Shopify OAuth callback (kodu alıp token oluşturma)
router.get("/oauth/callback", shopifyOauth.callback);

export const shopifyRouter = router;
