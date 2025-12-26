/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `hostel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "floor_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "hostel_name_key" ON "hostel"("name");
