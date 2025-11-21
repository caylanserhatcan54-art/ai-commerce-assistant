import { Request, Response } from "express";
import { shopService } from "./shop.service";

export const shopController = {
  async register(req: Request, res: Response) {
    try {
      const data = await shopService.register(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const data = await shopService.login(req.body);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
