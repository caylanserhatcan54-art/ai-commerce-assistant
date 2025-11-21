import Stripe from 'stripe';
import { env } from '@config/env';

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export const billingService = {
  async createSubscription(customerId: string, priceId: string) {
    if (!stripe) throw new Error('Stripe not configured');
    return stripe.subscriptions.create({ customer: customerId, items: [{ price: priceId }] });
  },
  async handleWebhook(payload: Buffer, signature: string | string[] | undefined) {
    if (!stripe || !env.stripeSecretKey) throw new Error('Stripe not configured');
    // placeholder for webhook verification
    return { received: true, signature };
  }
};
