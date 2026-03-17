/*
  Warnings:

  - You are about to drop the column `files` on the `owner` table. All the data in the column will be lost.
  - You are about to drop the column `properties` on the `owner` table. All the data in the column will be lost.
  - The `reference` column on the `owner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `entry` on the `tenant` table. All the data in the column will be lost.
  - You are about to drop the column `familialSituation` on the `tenant` table. All the data in the column will be lost.
  - You are about to drop the column `files` on the `tenant` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `owner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeletionType" AS ENUM ('OWNER', 'BUILDING', 'TENANT', 'UNIT', 'RENTAL', 'RESERVATION', 'PROPERTY_MANAGEMENT', 'INVOICING', 'QUOTE', 'CONTRACT', 'CHECK_IN', 'APPOINTMENT', 'SERVICE_PROVIDER', 'COMMUNICATION');

-- AlterTable
ALTER TABLE "building" ADD COLUMN     "isDeleting" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "owner" DROP COLUMN "files",
DROP COLUMN "properties",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "isDeleting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "reference",
ADD COLUMN     "reference" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "tenant" DROP COLUMN "entry",
DROP COLUMN "familialSituation",
DROP COLUMN "files",
ADD COLUMN     "documents" TEXT[],
ADD COLUMN     "income" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "isDeleting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatus" TEXT;

-- CreateTable
CREATE TABLE "reference" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "rental" TEXT NOT NULL,
    "invoicing" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "checkIn" TEXT NOT NULL,

    CONSTRAINT "reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "rentalStatus" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "rooms" TEXT NOT NULL,
    "rent" DECIMAL(65,30) NOT NULL,
    "furnished" TEXT NOT NULL,
    "wifi" BOOLEAN NOT NULL,
    "water" BOOLEAN NOT NULL,
    "electricity" BOOLEAN NOT NULL,
    "tv" BOOLEAN NOT NULL,
    "charges" DECIMAL(65,30) NOT NULL,
    "documents" TEXT[],
    "isDeleting" BOOLEAN NOT NULL DEFAULT false,
    "buildingId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental" (
    "id" TEXT NOT NULL,
    "reference" SERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "isDeleting" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deletion" (
    "id" TEXT NOT NULL,
    "type" "DeletionType" NOT NULL,
    "recordId" TEXT NOT NULL,
    "isValidate" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuildingToOwner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildingToOwner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "type_name_key" ON "type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deletion_recordId_key" ON "deletion"("recordId");

-- CreateIndex
CREATE INDEX "_BuildingToOwner_B_index" ON "_BuildingToOwner"("B");

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit" ADD CONSTRAINT "unit_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental" ADD CONSTRAINT "rental_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deletion" ADD CONSTRAINT "deletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToOwner" ADD CONSTRAINT "_BuildingToOwner_A_fkey" FOREIGN KEY ("A") REFERENCES "building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToOwner" ADD CONSTRAINT "_BuildingToOwner_B_fkey" FOREIGN KEY ("B") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
