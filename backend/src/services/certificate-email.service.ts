// src/services/certificate-email.service.ts
import prisma from "../lib/prisma";
import { resend } from "../lib/email";
import fs from "fs";
import path from "path";

export async function sendCertificateEmail(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: { event: true },
  });

  if (!participant || !participant.event) {
    throw new Error("Participant or event not found");
  }

  if (!participant.certificateGenerated) {
    throw new Error("Certificate not generated yet");
  }

  if (participant.certificateEmailed) {
    return { message: "Already emailed" };
  }

  const pdfPath = path.join(
    process.cwd(),
    `assets/certificates/generated/${participant.eventId}/${participant.id}.pdf`
  );

  if (!fs.existsSync(pdfPath)) {
    throw new Error("Certificate file missing");
  }

  const pdfBytes = fs.readFileSync(pdfPath);

  await resend.emails.send({
    from: "ClubOps <certificates@clubops.in>",
    to: participant.email,
    subject: `Your Certificate – ${participant.event.name}`,
    html: `
      <p>Hi ${participant.name},</p>
      <p>Thanks for attending <strong>${participant.event.name}</strong>.</p>
      <p>Your certificate is attached.</p>
    `,
    attachments: [
      {
        filename: "certificate.pdf",
        content: pdfBytes,
      },
    ],
  });

  await prisma.participant.update({
    where: { id: participantId },
    data: { certificateEmailed: true },
  });

  return { message: "Certificate emailed" };
}
