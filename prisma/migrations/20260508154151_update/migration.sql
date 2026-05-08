/*
  Warnings:

  - You are about to drop the column `clinic_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctor_id,clinic_id,day_of_week]` on the table `Availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ClinicRole" AS ENUM ('DOCTOR', 'ADMIN', 'RECEPTIONIST', 'STAFF');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DOCTOR';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clinic_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "doctor_id" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clinic_id";

-- CreateTable
CREATE TABLE "clinic_memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,
    "role" "ClinicRole" NOT NULL DEFAULT 'STAFF',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinic_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinic_memberships_user_id_clinic_id_key" ON "clinic_memberships"("user_id", "clinic_id");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_doctor_id_clinic_id_day_of_week_key" ON "Availability"("doctor_id", "clinic_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "clinic_memberships" ADD CONSTRAINT "clinic_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_memberships" ADD CONSTRAINT "clinic_memberships_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
