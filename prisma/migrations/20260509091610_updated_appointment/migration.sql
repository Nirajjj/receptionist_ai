-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_handled_by_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "handled_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
