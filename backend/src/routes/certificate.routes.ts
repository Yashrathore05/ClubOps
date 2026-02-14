import { Router } from "express";
import prisma from "../lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

/**
 * GET /certificates/:participantId
 * Download certificate PDF (ADMIN only)
 */
router.get(
  "/:participantId",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    const { participantId } = req.params;

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { event: true },
    });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    if (!participant.isPresent) {
      return res.status(403).json({ message: "Attendance not marked" });
    }

    if (!participant.certificateGenerated) {
      return res.status(403).json({ message: "Certificate not generated yet" });
    }

    const templatePath = participant.event.certificateTemplatePath;

    if (!templatePath || !fs.existsSync(templatePath)) {
      return res.status(500).json({
        message: "Certificate template missing for this event",
      });
    }

    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(templatePath)
    );

    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(participant.name, {
      x: 200,
      y: 300,
      size: 28,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(participant.event.name, {
      x: 180,
      y: 260,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${participant.id}.pdf`
    );

    res.send(Buffer.from(pdfBytes));
  }
);

export default router;
