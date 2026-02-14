import express from "express";
import cors from "cors";
import path from "path";
import prisma from "./lib/prisma";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import certificateRoutes from "./routes/certificate.routes";
import certificateTemplateRoutes from "./routes/certificate-template.routes";

import { requireAuth } from "./middleware/auth.middleware";
import { requireRole } from "./middleware/role.middleware";

const app = express();

/* --------------------------------
   Core middleware
-------------------------------- */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

/* --------------------------------
   Static files (IMPORTANT)
   This serves uploaded certificate PDFs
-------------------------------- */
app.use(
  "/uploads/templates",
  express.static(
    path.join(process.cwd(), "assets/certificates/templates")
  )
);

/* --------------------------------
   Redirect frontend pages (so shared links work even if backend URL is used)
-------------------------------- */
const frontendUrl = process.env.FRONTEND_APP_URL || process.env.FRONTEND_URL;
if (frontendUrl) {
  app.get("/events/:eventId/register", (req, res) => {
    res.redirect(302, `${frontendUrl}/events/${req.params.eventId}/register`);
  });
  app.get("/events/:eventId/attendance/:token", (req, res) => {
    res.redirect(302, `${frontendUrl}/events/${req.params.eventId}/attendance/${req.params.token}`);
  });
}

/* --------------------------------
   Routes
-------------------------------- */
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/events", certificateTemplateRoutes);
app.use("/certificates", certificateRoutes);

/* --------------------------------
   Health check
-------------------------------- */
app.get("/health", async (_, res) => {
  const clubCount = await prisma.club.count();

  res.json({
    status: "ok",
    clubs: clubCount,
  });
});

/* --------------------------------
   Test protected routes
-------------------------------- */
app.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: (req as any).userId,
  });
});

app.get(
  "/admin-only",
  requireAuth,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin. You have full access.",
    });
  }
);

export default app;
