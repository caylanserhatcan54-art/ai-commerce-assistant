import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes"; // <--- routes/index.ts
import admin from "firebase-admin";

// Load ENV
dotenv.config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIRESTORE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  console.log("🔥 Firebase Admin Initialized");
  console.log("🔥 FIRESTORE_PROJECT_ID:", process.env.FIRESTORE_PROJECT_ID);
  console.log("🔥 FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
}
