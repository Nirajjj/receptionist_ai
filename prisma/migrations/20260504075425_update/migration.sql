/*
  Warnings:

  - You are about to drop the column `clinicId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `handledById` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `CallLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `CallLog` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `clinic_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinic_id` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinic_id` to the `CallLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_handledById_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "CallLog" DROP CONSTRAINT "CallLog_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clinicId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "clinicId",
DROP COLUMN "createdAt",
DROP COLUMN "handledById",
DROP COLUMN "patientId",
ADD COLUMN     "clinic_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "handled_by_id" TEXT,
ADD COLUMN     "patient_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "clinicId",
DROP COLUMN "createdAt",
DROP COLUMN "dayOfWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "clinic_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day_of_week" INTEGER NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CallLog" DROP COLUMN "clinicId",
DROP COLUMN "createdAt",
ADD COLUMN     "clinic_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt",
DROP COLUMN "isRead",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clinicId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "clinic_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
