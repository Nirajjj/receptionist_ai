/*
  Warnings:

  - You are about to drop the column `end_time` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `end_minutes` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_minutes` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "duration_mins" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "end_minutes" INTEGER NOT NULL,
ADD COLUMN     "slot_duration" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "start_minutes" INTEGER NOT NULL;
