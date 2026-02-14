import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

/* --------------------------------
   Multer config (PDF only)
-------------------------------- */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});

/* --------------------------------
   GET template + layout
-------------------------------- */
router.get(
  "/:eventId/certificate-template",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        certificateTemplatePath: true,
        certificateLayout: true,
      },
    });

    if (!event || !event.certificateTemplatePath) {
      return res.json({ url: null });
    }

    res.json({
      url: `/uploads/templates/${eventId}.pdf`,
      layout: event.certificateLayout,
    });
  }
);

/* --------------------------------
   UPLOAD template
-------------------------------- */
router.post(
  "/:eventId/certificate-template",
  requireAuth,
  requireRole("ADMIN"),
  upload.single("template"),
  async (req, res) => {
    const { eventId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Certificate template PDF is required",
      });
    }

    const templatesDir = path.join(
      process.cwd(),
      "assets/certificates/templates"
    );

    fs.mkdirSync(templatesDir, { recursive: true });

    const filePath = path.join(templatesDir, `${eventId}.pdf`);
    fs.writeFileSync(filePath, req.file.buffer);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        certificateTemplatePath: filePath,
      },
    });

    res.json({
      message: "Certificate template uploaded successfully",
      url: `/uploads/templates/${eventId}.pdf`,
    });
  }
);

/* --------------------------------
   SAVE layout
-------------------------------- */
router.post(
  "/:eventId/certificate-layout",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { eventId } = req.params;

    await prisma.event.update({
      where: { id: eventId },
      data: {
        certificateLayout: req.body,
      },
    });

    res.json({ message: "Layout saved" });
  }
);

export default router;
