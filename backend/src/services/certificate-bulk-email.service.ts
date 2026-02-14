import prisma from "../lib/prisma";
import { sendCertificateEmail } from "./certificate-email.service";

export async function emailCertificatesForEvent(eventId: string) {
  const participants = await prisma.participant.findMany({
    where: {
      eventId,
      isPresent: true,
      certificateGenerated: true,
      certificateEmailed: false,
    },
  });

  if (participants.length === 0) {
    return { message: "No certificates to email" };
  }

  for (const p of participants) {
    await sendCertificateEmail(p.id);
  }

  return {
    message: "Certificates emailed",
    count: participants.length,
  };
}
