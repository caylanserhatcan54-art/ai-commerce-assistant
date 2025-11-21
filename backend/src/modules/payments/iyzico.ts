// backend/src/modules/payments/iyzico.ts

/* eslint-disable @typescript-eslint/no-var-requires */
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_BASE_URL || "https://sandbox-api.iyzipay.com",
});

const DEFAULT_PRICE =
  process.env.SUBSCRIPTION_PRICE && !Number.isNaN(Number(process.env.SUBSCRIPTION_PRICE))
    ? Number(process.env.SUBSCRIPTION_PRICE)
    : 99.9;

/**
 * Abonelik (veya lisans) için iyzico Checkout Form başlat
 * Dönen checkoutFormContent'i frontend'te direkt sayfaya basacağız.
 */
export const initializeCheckoutForm = (params: {
  shopId: string;
  email: string;
  fullName: string;
  clientIp?: string;
  price?: number;
}) => {
  const { shopId, email, fullName, clientIp, price } = params;

  const [name, ...rest] = fullName.split(" ");
  const firstName = name || "Musteri";
  const lastName = rest.join(" ") || "Soyad";

  const finalPrice = price && price > 0 ? price : DEFAULT_PRICE;
  const priceStr = finalPrice.toFixed(2);

  const conversationId = `shop-${shopId}-${Date.now()}`;

  const callbackUrl = `${process.env.APP_URL || "http://localhost:4000"}/api/billing/callback`;

  const request: any = {
    locale: Iyzipay.LOCALE.TR,
    conversationId,
    price: priceStr,
    paidPrice: priceStr,
    currency: Iyzipay.CURRENCY.TRY,
    basketId: `B-${shopId}`,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl,
    buyer: {
      id: `BY-${shopId}`,
      name: firstName,
      surname: lastName,
      gsmNumber: "+905350000000", // İsteğe göre kullanıcıdan alırsın
      email,
      identityNumber: "11111111111", // Test için sabit. Gerçek senaryoda TCKN isteyebilirsin.
      lastLoginDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      registrationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      registrationAddress: "Adres belirtilmedi",
      ip: clientIp || "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34000",
    },
    shippingAddress: {
      contactName: fullName,
      city: "Istanbul",
      country: "Turkey",
      address: "Adres belirtilmedi",
      zipCode: "34000",
    },
    billingAddress: {
      contactName: fullName,
      city: "Istanbul",
      country: "Turkey",
      address: "Adres belirtilmedi",
      zipCode: "34000",
    },
    basketItems: [
      {
        id: `SUB-${shopId}`,
        name: "AI Shop Assistant Aylık Lisans",
        category1: "Yazilim",
        category2: "Abonelik",
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price: priceStr,
      },
    ],
  };

  return new Promise<{
    checkoutFormContent: string;
    token: string;
    conversationId: string;
  }>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
      if (err) {
        console.error("iyzico checkoutFormInitialize ERROR:", err);
        return reject(err);
      }

      if (result.status !== "success") {
        console.error("iyzico checkoutFormInitialize FAILURE:", result);
        return reject(
          new Error(result.errorMessage || "iyzico checkout form oluşturulamadı")
        );
      }

      resolve({
        checkoutFormContent: result.checkoutFormContent,
        token: result.token,
        conversationId,
      });
    });
  });
};

/**
 * Ödeme formu tamamlandıktan sonra, iyzico callback üzerinden gönderdiği token ile sonucu sorgularız
 */
export const retrieveCheckoutForm = (token: string) => {
  const request: any = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: `retrieve-${Date.now()}`,
    token,
  };

  return new Promise<any>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err: any, result: any) => {
      if (err) {
        console.error("iyzico checkoutForm.retrieve ERROR:", err);
        return reject(err);
      }

      if (result.status !== "success") {
        console.error("iyzico checkoutForm.retrieve FAILURE:", result);
        return reject(
          new Error(result.errorMessage || "Ödeme sorgulama başarısız")
        );
      }

      resolve(result);
    });
  });
};
