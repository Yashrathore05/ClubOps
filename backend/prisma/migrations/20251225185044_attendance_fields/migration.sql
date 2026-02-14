-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attendanceToken" TEXT;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "isPresent" BOOLEAN NOT NULL DEFAULT false;
