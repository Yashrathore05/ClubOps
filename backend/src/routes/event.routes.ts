import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import crypto from "crypto";

import { generateCertificatesForEvent } from "../services/certificate.service";
import { emailCertificatesForEvent } from "../services/certificate-bulk-email.service";
import { getEventStatus } from "../services/event-status.service";

const router = Router();

/* =========================
   CREATE EVENT
========================= */
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { name, type, date, venue, description } = req.body;
    const userId = (req as any).userId;

    if (!name || !type || !date || !venue) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const role = await prisma.roleAssignment.findFirst({
      where: { userId },
    });

    if (!role) {
      return res.status(403).json({ message: "No club access" });
    }

    const event = await prisma.event.create({
      data: {
        name,
        type,
        date: new Date(date),
        venue,
        description,
        clubId: role.clubId,
        academicYearId: role.academicYearId,
      },
    });

    res.status(201).json({ message: "Event created", event });
  }
);

/* =========================
   LIST EVENTS
========================= */
router.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const role = await prisma.roleAssignment.findFirst({
    where: { userId },
  });

  if (!role) {
    return res.status(403).json({ message: "No club access" });
  }

  const events = await prisma.event.findMany({
    where: { clubId: role.clubId },
    orderBy: { date: "desc" },
  });

  res.json({ events });
});

/* =========================
   PUBLIC EVENT INFO
========================= */
router.get("/:eventId/public", async (req, res) => {
  const { eventId } = req.params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      name: true,
      date: true,
      venue: true,
      description: true,
      certificateTemplatePath: true,
      certificateLayout: true,
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ event });
});

/* =========================
   LIST PARTICIPANTS (ADMIN)
========================= */
router.get(
  "/:eventId/participants",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    const participants = await prisma.participant.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });

    res.json({ participants });
  }
);

/* =========================
   REGISTER PARTICIPANT
========================= */
router.post("/:eventId/register", async (req, res) => {
  const { eventId } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const participant = await prisma.participant.create({
      data: { name, email, phone, eventId },
    });

    res.status(201).json({
      message: "Registered successfully",
      participant,
    });
  } catch {
    res.status(409).json({ message: "Already registered" });
  }
});

/* =========================
   GENERATE ATTENDANCE TOKEN
========================= */
router.post(
  "/:eventId/attendance-token",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;
    const token = crypto.randomUUID();

    await prisma.event.update({
      where: { id: eventId },
      data: { attendanceToken: token },
    });

    res.json({
      message: "Attendance token generated",
      token,
      attendanceUrl: `/events/${eventId}/attendance/${token}`,
    });
  }
);

/* =========================
   MARK ATTENDANCE
========================= */
router.post("/:eventId/attendance/:token", async (req, res) => {
  const { eventId, token } = req.params;
  const { email } = req.body;

  const event = await prisma.event.findFirst({
    where: { id: eventId, attendanceToken: token },
  });

  if (!event) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const participant = await prisma.participant.findUnique({
    where: { email_eventId: { email, eventId } },
  });

  if (!participant) {
    return res.status(404).json({ message: "Not registered" });
  }

  if (participant.isPresent) {
    return res.status(409).json({ message: "Already marked present" });
  }

  await prisma.participant.update({
    where: { id: participant.id },
    data: { isPresent: true },
  });

  res.json({ message: "Attendance marked" });
});

/* =========================
   GENERATE CERTIFICATES
========================= */
router.post(
  "/:eventId/certificates/generate",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    const result = await generateCertificatesForEvent(eventId);
    res.json(result);
  }
);

/* =========================
   EMAIL CERTIFICATES (BULK)
========================= */
router.post(
  "/:eventId/certificates/email",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    const result = await emailCertificatesForEvent(eventId);
    res.json(result);
  }
);

/* =========================
   EVENT STATUS
========================= */
router.get(
  "/:eventId/status",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    try {
      const status = await getEventStatus(eventId);
      res.json(status);
    } catch (err: any) {
      return res.status(404).json({
        message: err.message || "Event not found",
      });
    }
  }
);

export default router;
