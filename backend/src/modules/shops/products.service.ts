import admin from "firebase-admin";

export async function getShopProducts(shopId: string) {
  const snapshot = await admin
    .firestore()
    .collection("shops")
    .doc(shopId)
    .collection("products")
    .get();

  return snapshot.docs.map((doc) => doc.data());
}
