// src/services/certificate.service.ts
import prisma from "../lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

type CertificateLayout = {
  name: { x: number; y: number };
  event: { x: number; y: number };
};

export async function generateCertificatesForEvent(eventId: string) {
  // 1️⃣ Fetch event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.certificateTemplatePath) {
    throw new Error("Certificate template not uploaded for this event");
  }

  if (!fs.existsSync(event.certificateTemplatePath)) {
    throw new Error("Certificate template file missing on server");
  }

  const layout: CertificateLayout =
    (event.certificateLayout as any) || {
      name: { x: 0.4, y: 0.6 },
      event: { x: 0.4, y: 0.55 },
    };

  // 2️⃣ Eligible participants
  const participants = await prisma.participant.findMany({
    where: {
      eventId,
      isPresent: true,
      certificateGenerated: false,
    },
  });

  if (participants.length === 0) {
    return { message: "No eligible participants" };
  }

  // 3️⃣ Output directory
  const outputDir = path.join(
    process.cwd(),
    `assets/certificates/generated/${eventId}`
  );

  fs.mkdirSync(outputDir, { recursive: true });

  // 4️⃣ Generate PDFs
  for (const p of participants) {
    const pdfDoc = await PDFDocument.load(
      fs.readFileSync(event.certificateTemplatePath)
    );

    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Convert normalized → PDF coords
    const nameX = layout.name.x * width;
    const nameY = height - layout.name.y * height;

    const eventX = layout.event.x * width;
    const eventY = height - layout.event.y * height;

    page.drawText(p.name, {
      x: nameX,
      y: nameY,
      size: 28,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(event.name, {
      x: eventX,
      y: eventY,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(
      path.join(outputDir, `${p.id}.pdf`),
      pdfBytes
    );
  }

  // 5️⃣ Mark generated
  await prisma.participant.updateMany({
    where: {
      eventId,
      isPresent: true,
      certificateGenerated: false,
    },
    data: {
      certificateGenerated: true,
    },
  });

  return {
    message: "Certificates generated",
    count: participants.length,
  };
}
