import axios from 'axios';
import { env } from '@config/env';

interface ChatRequest {
  message: string;
  context?: Record<string, unknown>;
}

const localClient = axios.create({ baseURL: env.ollamaBaseUrl || 'http://localhost:11434' });
const openAiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: { Authorization: `Bearer ${env.openAiApiKey}` }
});

async function chatLocal(payload: ChatRequest) {
  return localClient.post('/api/chat', payload).then((res) => res.data);
}

async function chatOpenAi(payload: ChatRequest) {
  return openAiClient.post('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: payload.message }],
    ...payload.context
  }).then((res) => res.data);
}

export const aiProvider = {
  async chat(payload: ChatRequest) {
    try {
      return await chatLocal(payload);
    } catch (error) {
      if (!env.openAiApiKey) throw error;
      return chatOpenAi(payload);
    }
  },
  async recommend(products: unknown[], preferences?: Record<string, unknown>) {
    return this.chat({
      message: 'Provide product recommendations',
      context: { products, preferences }
    });
  }
};