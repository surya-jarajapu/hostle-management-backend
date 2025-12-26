-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'NONE';
