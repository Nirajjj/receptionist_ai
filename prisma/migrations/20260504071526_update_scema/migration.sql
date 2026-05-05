/*
  Warnings:

  - Added the required column `clinicId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `startTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clinicId` to the `CallLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CallLog" ADD COLUMN     "clinicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallLog" ADD CONSTRAINT "CallLog_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
