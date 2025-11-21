import { Router } from "express";

import { aiRouter } from "./ai";
import { shopRouter } from "./shops";
import { shopierRouter } from "./shopier";
import { webhookRouter } from "./webhooks";
import { billingRouter } from "./billing";
import { authRouter } from "./auth";

export const router = Router();

/* AUTH */
router.use("/auth", authRouter);

/* AI ASSISTANT */
router.use("/ai", aiRouter);

/* SHOPS */
router.use("/shops", shopRouter);

/* SHOPIER */
router.use("/shopier", shopierRouter);

/* WEBHOOKS */
router.use("/webhooks", webhookRouter);

/* BILLING (IYZICO) */
router.use("/billing", billingRouter);

/* HEALTH CHECK */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "AI Commerce Backend Running 🚀",
  });
});
