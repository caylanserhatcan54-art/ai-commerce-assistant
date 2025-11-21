import { Request, Response } from "express";
import axios from "axios";

export const shopifyOauth = {
  async install(req: Request, res: Response) {
    try {
      const { shop } = req.query as { shop: string };

      if (!shop) {
        return res.status(400).json({ error: "Missing shop parameter" });
      }

      const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;
      const clientId = process.env.SHOPIFY_CLIENT_ID!;
      const scopes = process.env.SHOPIFY_SCOPES!;

      // Debug logs
      console.log("REDIRECT_URI_BACKEND:", redirectUri);
      console.log("CLIENT_ID:", clientId);
      console.log("SCOPES:", scopes);
      console.log("SHOP:", shop);

      // 🔥 CRITICAL FIX → redirect_uri encode edilmesi zorunlu!
      const encodedRedirect = encodeURIComponent(redirectUri);

      // OAuth URL
      const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodedRedirect}`;

      // Debug → Shopify'a gönderilen gerçek URL
      console.log("INSTALL_URL_BACKEND:", installUrl);

      return res.redirect(installUrl);

    } catch (error: any) {
      console.error("INSTALL ERROR:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  async callback(req: Request, res: Response) {
    try {
      const { shop, code } = req.query as { shop: string; code: string };

      console.log("CALLBACK SHOP:", shop);
      console.log("CALLBACK CODE:", code);

      const tokenResponse = await axios.post(
        `https://${shop}/admin/oauth/access_token`,
        {
          client_id: process.env.SHOPIFY_CLIENT_ID,
          client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          code,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      console.log("ACCESS_TOKEN_RECEIVED");

      return res.json({
        message: "Shopify OAuth başarılı!",
        shop,
        accessToken,
      });
    } catch (error: any) {
      console.error("CALLBACK ERROR:", error.message);
      return res.status(500).json({ error: error.message });
    }
  },
};
