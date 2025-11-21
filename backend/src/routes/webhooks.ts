import { Router } from 'express';
import { webhookController } from '@modules/webhooks/webhook.controller';

export const webhookRouter = Router();

webhookRouter.post('/shopify', webhookController.handleShopify);
webhookRouter.post('/trendyol', webhookController.handleTrendyol);
webhookRouter.post('/shopier', webhookController.handleShopier);