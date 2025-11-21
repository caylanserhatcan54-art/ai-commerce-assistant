import dotenv from "dotenv";
import path from "path";

// .env dosyasını firebase içinde manuel yükle
dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

import admin from "firebase-admin";
import { env } from "./env";

console.log("🔥 FIREBASE LOADED ENV:");
console.log("FIRESTORE_PROJECT_ID:", process.env.FIRESTORE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);

if (
  !process.env.FIRESTORE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  console.error("❌ Firebase ortam değişkenleri eksik!");
  console.error("FIRESTORE_PROJECT_ID:", process.env.FIRESTORE_PROJECT_ID);
  console.error("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
  console.error("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 10));
}

const app = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIRESTORE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

export const firebaseAdmin = app;
export const firestore = admin.firestore(app);
