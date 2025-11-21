export interface Shop {
  id: string;
  name: string;
  platform: 'shopify' | 'trendyol' | 'shopier' | 'ikas' | 'custom';
  accessToken?: string;
  domain?: string;
  ownerUserId: string;
  apiKey: string;
  createdAt: number;
  billingPlan?: string;
}