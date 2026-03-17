/*
  Warnings:

  - You are about to drop the column `address` on the `building` table. All the data in the column will be lost.
  - Added the required column `location` to the `building` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "building" DROP COLUMN "address",
ADD COLUMN     "location" TEXT NOT NULL;
