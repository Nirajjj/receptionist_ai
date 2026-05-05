/*
  Warnings:

  - Added the required column `doctor_id` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" ADD COLUMN     "doctor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
