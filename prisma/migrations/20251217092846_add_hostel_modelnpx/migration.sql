/*
  Warnings:

  - You are about to drop the column `joiningDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nextFeeDate` on the `User` table. All the data in the column will be lost.
  - Added the required column `due_amount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_fee` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "joiningDate",
DROP COLUMN "nextFeeDate",
ADD COLUMN     "due_amount" INTEGER NOT NULL,
ADD COLUMN     "joining_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monthly_fee" INTEGER NOT NULL,
ADD COLUMN     "next_fee_date" TIMESTAMP(3),
ADD COLUMN     "user_fee_receipt" TEXT;
