/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CvEventType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- DropForeignKey
ALTER TABLE "Cv" DROP CONSTRAINT "Cv_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "CvEvent" (
    "id" TEXT NOT NULL,
    "type" "CvEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CvEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cv" ADD CONSTRAINT "Cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvEvent" ADD CONSTRAINT "CvEvent_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvEvent" ADD CONSTRAINT "CvEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
