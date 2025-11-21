import admin from "firebase-admin";

export async function getShopSettings(shopId: string) {
  const ref = admin.firestore().collection("shops").doc(shopId);
  const doc = await ref.get();

  if (!doc.exists) return null;

  return doc.data();
}
