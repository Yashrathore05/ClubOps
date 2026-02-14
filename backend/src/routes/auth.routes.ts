import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

const frontendUrl = process.env.FRONTEND_APP_URL || process.env.FRONTEND_URL || "http://localhost:3000";
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL ||
  (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/google/callback` : "http://localhost:3001/auth/google/callback");

/* --------------------------------
   Club registration (public – any club can sign up)
-------------------------------- */
router.post("/register", async (req, res) => {
  const {
    clubName,
    collegeName,
    clubEmail,
    adminName,
    adminEmail,
    password,
    academicYearLabel,
  } = req.body;

  if (!clubName || !collegeName || !clubEmail || !adminName || !adminEmail || !password) {
    return res.status(400).json({
      message: "Club name, college, club email, admin name, admin email and password are required",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const yearLabel = (academicYearLabel || "2024-25").trim();

  const existingClub = await prisma.club.findUnique({
    where: { clubEmail: clubEmail.trim().toLowerCase() },
  });
  if (existingClub) {
    return res.status(409).json({ message: "A club with this email is already registered" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail.trim().toLowerCase() },
  });
  if (existingUser) {
    return res.status(409).json({ message: "This admin email is already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const club = await prisma.club.create({
    data: {
      name: clubName.trim(),
      collegeName: collegeName.trim(),
      clubEmail: clubEmail.trim().toLowerCase(),
    },
  });

  const academicYear = await prisma.academicYear.create({
    data: {
      clubId: club.id,
      yearLabel,
      isActive: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: adminName.trim(),
      email: adminEmail.trim().toLowerCase(),
      passwordHash,
    },
  });

  await prisma.roleAssignment.create({
    data: {
      userId: user.id,
      clubId: club.id,
      academicYearId: academicYear.id,
      role: "ADMIN",
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(201).json({
    message: "Club registered successfully",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    club: {
      id: club.id,
      name: club.name,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

/* --------------------------------
   Google OAuth – start
-------------------------------- */
router.get("/google", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = googleCallbackUrl;
  if (!clientId) {
    return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
  }
  const scopes = ["openid", "email", "profile"];
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  }).toString()}`;
  res.redirect(url);
});

/* --------------------------------
   Google OAuth – callback (redirects to frontend with token)
-------------------------------- */
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret || !code || typeof code !== "string") {
    return res.redirect(`${frontendUrl}/login?error=google_config`);
  }
  try {
    const oauth2Client = new OAuth2Client(clientId, clientSecret, googleCallbackUrl);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    if (!tokens.id_token) {
      return res.redirect(`${frontendUrl}/login?error=no_id_token`);
    }
    const ticket = await oauth2Client.verifyIdToken({ idToken: tokens.id_token });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.redirect(`${frontendUrl}/login?error=no_email`);
    }
    const email = payload.email.toLowerCase();
    const name = payload.name || payload.email.split("@")[0] || "User";
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const passwordHash = crypto.randomBytes(32).toString("hex");
      user = await prisma.user.create({
        data: { email, name, passwordHash },
      });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    return res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
});

/* --------------------------------
   Set session from token (used after Google redirect)
-------------------------------- */
router.post("/session", async (req, res) => {
  const { token: tokenFromBody } = req.body;
  if (!tokenFromBody || typeof tokenFromBody !== "string") {
    return res.status(400).json({ message: "Token required" });
  }
  try {
    const payload = jwt.verify(tokenFromBody, process.env.JWT_SECRET!) as { userId: string };
    const assignment = await prisma.roleAssignment.findFirst({
      where: { userId: payload.userId },
    });
    res.cookie("token", tokenFromBody, { httpOnly: true, sameSite: "lax" });
    return res.json({
      redirect: assignment ? "events" : "onboarding",
    });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

/* --------------------------------
   Complete club setup (for Google sign-up users)
-------------------------------- */
router.post("/complete-club", async (req, res) => {
  const rawToken = req.cookies?.token;
  if (!rawToken) return res.status(401).json({ message: "Unauthorized" });
  let userId: string;
  try {
    const payload = jwt.verify(rawToken, process.env.JWT_SECRET!) as { userId: string };
    userId = payload.userId;
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
  const { clubName, collegeName, clubEmail, academicYearLabel } = req.body;
  if (!clubName || !collegeName || !clubEmail) {
    return res.status(400).json({ message: "Club name, college, and club email are required" });
  }
  const yearLabel = (academicYearLabel || "2024-25").trim();
  const existingAssignment = await prisma.roleAssignment.findFirst({ where: { userId } });
  if (existingAssignment) {
    return res.status(400).json({ message: "You already have a club" });
  }
  const existingClub = await prisma.club.findUnique({
    where: { clubEmail: clubEmail.trim().toLowerCase() },
  });
  if (existingClub) {
    return res.status(409).json({ message: "A club with this email is already registered" });
  }
  const club = await prisma.club.create({
    data: {
      name: clubName.trim(),
      collegeName: collegeName.trim(),
      clubEmail: clubEmail.trim().toLowerCase(),
    },
  });
  const academicYear = await prisma.academicYear.create({
    data: { clubId: club.id, yearLabel, isActive: true },
  });
  await prisma.roleAssignment.create({
    data: { userId, clubId: club.id, academicYearId: academicYear.id, role: "ADMIN" },
  });
  return res.json({ message: "Club created", redirect: "events" });
});

import { requireAuth } from "../middleware/auth.middleware";

router.get("/me", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const assignment = await prisma.roleAssignment.findFirst({
    where: { userId },
    include: {
      user: true,
      club: true,
      academicYear: true,
    },
  });

  if (!assignment) {
    return res.status(404).json({ message: "No active role" });
  }

  res.json({
    user: {
      name: assignment.user.name,
      email: assignment.user.email,
    },
    club: {
      name: assignment.club.name,
    },
    academicYear: {
      yearLabel: assignment.academicYear.yearLabel,
    },
  });
});


export default router;
