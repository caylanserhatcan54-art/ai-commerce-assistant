# API Endpoint Şemaları

## OAuth ve Entegrasyon
- `POST /api/shops` mağaza kaydı
- `GET /api/shops/:shopId` mağaza detayı
- `GET /api/shops/:shopId/products` ürün listesi
- `GET /api/shops/:shopId/orders` sipariş listesi
- `GET /api/shops/:shopId/analytics` mağaza analitiği

## AI
- `POST /api/ai/chat` { message, context?, shopId? }
- `POST /api/ai/recommendations` { shopId, preferences? }
- `GET /api/ai/analytics` mağaza analitiği özeti

## Webhooks
- `POST /api/webhooks/shopify`
- `POST /api/webhooks/trendyol`
- `POST /api/webhooks/shopier`

## Billing
- Stripe/Iyzico webhook uçları (taslak)

## Auth
- JWT bearer token `Authorization: Bearer <token>`