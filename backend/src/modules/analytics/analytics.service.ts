import { firestore } from '@config/firebase';

export interface AnalyticsSummary {
  topProducts: string[];
  topViewed: string[];
  topQuestions: string[];
  stockAlerts: { productId: string; inventory: number }[];
  pricingHints: { productId: string; suggestedPrice: number }[];
  growthIdeas: string[];
}

export const analyticsService = {
  async getSummary(shopId: string): Promise<AnalyticsSummary> {
    const analyticsDoc = await firestore.collection('analytics').doc(shopId).get();
    const data = analyticsDoc.data();
    return {
      topProducts: data?.topProducts || [],
      topViewed: data?.topViewed || [],
      topQuestions: data?.topQuestions || [],
      stockAlerts: data?.stockAlerts || [],
      pricingHints: data?.pricingHints || [],
      growthIdeas: data?.growthIdeas || []
    };
  }
};