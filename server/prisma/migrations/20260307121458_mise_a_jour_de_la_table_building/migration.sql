/*
  Warnings:

  - You are about to alter the column `parkingPrice` on the `building` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,2)`.

*/
-- AlterTable
ALTER TABLE "building" ADD COLUMN     "reference" SERIAL NOT NULL,
ALTER COLUMN "parkingPrice" SET DATA TYPE DECIMAL(15,2);
