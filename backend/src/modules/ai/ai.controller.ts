import { Request, Response } from 'express';
import { aiService } from './ai.service';

export const aiController = {
  async handleChat(req: Request, res: Response) {
    const { message, context } = req.body;
    const shopId = req.auth?.shopId || req.body.shopId;
    const response = await aiService.chat({ message, context, shopId });
    res.json(response);
  },

  async recommendProducts(req: Request, res: Response) {
    const shopId = req.auth?.shopId || req.body.shopId;
    const { preferences } = req.body;
    const response = await aiService.recommend({ shopId, preferences });
    res.json(response);
  },

  async analyticsSummary(req: Request, res: Response) {
    const shopId = req.auth?.shopId;
    const response = await aiService.analytics(shopId);
    res.json(response);
  }
};