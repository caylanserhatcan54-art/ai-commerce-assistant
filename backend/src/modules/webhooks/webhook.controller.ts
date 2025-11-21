import { Request, Response } from 'express';
import { webhookService } from './webhook.service';

export const webhookController = {
  async handleShopify(req: Request, res: Response) {
    await webhookService.process('shopify', req.body);
    res.json({ received: true });
  },
  async handleTrendyol(req: Request, res: Response) {
    await webhookService.process('trendyol', req.body);
    res.json({ received: true });
  },
  async handleShopier(req: Request, res: Response) {
    await webhookService.process('shopier', req.body);
    res.json({ received: true });
  }
};