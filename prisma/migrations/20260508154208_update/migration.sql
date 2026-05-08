/*
  Warnings:

  - Made the column `handled_by_id` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_handled_by_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "handled_by_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
