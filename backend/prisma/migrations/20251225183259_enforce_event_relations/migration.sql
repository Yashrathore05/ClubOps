/*
  Warnings:

  - Made the column `academicYearId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clubId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_clubId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "academicYearId" SET NOT NULL,
ALTER COLUMN "clubId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
