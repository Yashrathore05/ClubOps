import prisma from "../lib/prisma";
import { Participant } from "@prisma/client";

export async function getEventStatus(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: true,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const totalParticipants = event.participants.length;

  const presentCount = event.participants.filter(
    (p: Participant) => p.isPresent
  ).length;

  const certificatesGenerated = event.participants.filter(
    (p: Participant) => p.certificateGenerated
  ).length;

  const certificatesEmailed = event.participants.filter(
    (p: Participant) => p.certificateEmailed
  ).length;

  let status: string = "DRAFT";

  if (event.attendanceToken) {
    status = "REGISTRATION_OPEN";
  }

  if (presentCount > 0) {
    status = "IN_PROGRESS";
  }

  if (certificatesGenerated > 0) {
    status = "COMPLETED";
  }

  if (
    certificatesGenerated > 0 &&
    certificatesGenerated === certificatesEmailed
  ) {
    status = "CLOSED";
  }

  return {
    eventId: event.id,
    status,
    stats: {
      totalParticipants,
      presentCount,
      certificatesGenerated,
      certificatesEmailed,
    },
  };
}
