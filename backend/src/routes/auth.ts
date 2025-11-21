import { Router, Request, Response } from "express";
import admin from "firebase-admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authRouter = Router();

const USERS_COLLECTION = "users";

function signToken(payload: any) {
  const secret = process.env.JWT_SECRET || "dev_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

async function findUserByEmail(email: string) {
  const snap = await admin
    .firestore()
    .collection(USERS_COLLECTION)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();

  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
}

/* ============================
   REGISTER  POST /api/auth/register
============================ */
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "email, password ve name zorunludur",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Bu email ile kayıtlı kullanıcı zaten var",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const docRef = await admin.firestore().collection(USERS_COLLECTION).add({
      email: email.toLowerCase(),
      name,
      passwordHash,
      createdAt: Date.now(),
    });

    const token = signToken({ uid: docRef.id, email: email.toLowerCase() });

    return res.json({
      success: true,
      token,
      user: {
        id: docRef.id,
        email: email.toLowerCase(),
        name,
      },
    });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ============================
   LOGIN  POST /api/auth/login
============================ */
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "email ve password zorunludur",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Email veya şifre hatalı",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({
        success: false,
        error: "Email veya şifre hatalı",
      });
    }

    const token = signToken({ uid: user.id, email: user.email });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ============================
   ME  GET /api/auth/me
============================ */
authRouter.get("/me", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token bulunamadı",
      });
    }

    const secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as any;

    return res.json({
      success: true,
      user: {
        id: decoded.uid,
        email: decoded.email,
      },
    });
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: "Geçersiz veya süresi dolmuş token",
    });
  }
});
