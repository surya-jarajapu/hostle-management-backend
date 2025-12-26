/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomNumber` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `totalBeds` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hostel_id,email]` on the table `MasterUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hostel_id,mobile]` on the table `MasterUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hostel_id,room_number]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hostel_id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hostel_id,mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostel_id` to the `MasterUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostel_id` to the `Room` table without a default value. This is not possible if the table is not empty.
  - The required column `room_id` was added to the `Room` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `room_number` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_beds` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostel_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomId_fkey";

-- DropIndex
DROP INDEX "MasterUser_mobile_key";

-- DropIndex
DROP INDEX "Room_roomNumber_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_mobile_key";

-- AlterTable
ALTER TABLE "MasterUser" ADD COLUMN     "hostel_id" TEXT NOT NULL,
ALTER COLUMN "modified_date_time" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
DROP COLUMN "roomNumber",
DROP COLUMN "totalBeds",
ADD COLUMN     "hostel_id" TEXT NOT NULL,
ADD COLUMN     "room_id" TEXT NOT NULL,
ADD COLUMN     "room_number" TEXT NOT NULL,
ADD COLUMN     "total_beds" INTEGER NOT NULL,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId",
DROP COLUMN "userImage",
DROP COLUMN "username",
ADD COLUMN     "hostel_id" TEXT NOT NULL,
ADD COLUMN     "room_id" TEXT,
ADD COLUMN     "user_image" TEXT,
ADD COLUMN     "user_name" TEXT NOT NULL,
ALTER COLUMN "modified_date_time" DROP DEFAULT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "hostel" (
    "hostel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "added_date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hostel_pkey" PRIMARY KEY ("hostel_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hostel_name_key" ON "hostel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUser_hostel_id_email_key" ON "MasterUser"("hostel_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUser_hostel_id_mobile_key" ON "MasterUser"("hostel_id", "mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Room_hostel_id_room_number_key" ON "Room"("hostel_id", "room_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_hostel_id_email_key" ON "User"("hostel_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_hostel_id_mobile_key" ON "User"("hostel_id", "mobile");

-- AddForeignKey
ALTER TABLE "MasterUser" ADD CONSTRAINT "MasterUser_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostel"("hostel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostel"("hostel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostel"("hostel_id") ON DELETE RESTRICT ON UPDATE CASCADE;
