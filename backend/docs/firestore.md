# Firestore Koleksiyon Şemaları

## shops
- **name**: mağaza adı
- **platform**: shopify | trendyol | shopier | ikas | custom
- **ownerUserId**: UID
- **apiKey**: embed için üretilecek key
- **accessToken**: platform erişim tokenı
- **domain**: mağaza domaini
- **billingPlan**: abonelik planı
- **createdAt**: timestamp

## products
- **shopId**: mağaza referansı
- **title**, **description**, **price**, **currency**, **inventory**, **tags**, **vendor**, **images**

## orders
- **shopId**
- **items**: [{ productId, quantity, price }]
- **status**, **total**, **currency**, **customer**, **createdAt**

## analytics
- **topProducts**: ürün id listesi
- **topViewed**
- **topQuestions**
- **stockAlerts**: [{ productId, inventory }]
- **pricingHints**: [{ productId, suggestedPrice }]
- **growthIdeas**: string[]

## conversations
- **shopId**, **type**: customer | merchant
- **messages**: { role, content, createdAt }
- **sessionId**

## billing
- **shopId**, **planId**, **status**, **renewAt**, **usageTokens**

## webhook_logs
- **source**, **payload**, **receivedAt**