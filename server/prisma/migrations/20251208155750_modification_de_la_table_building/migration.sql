/*
  Warnings:

  - You are about to drop the `_BuildingToOwner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BuildingToOwner" DROP CONSTRAINT "_BuildingToOwner_A_fkey";

-- DropForeignKey
ALTER TABLE "_BuildingToOwner" DROP CONSTRAINT "_BuildingToOwner_B_fkey";

-- AlterTable
ALTER TABLE "building" ADD COLUMN     "ownerId" TEXT;

-- DropTable
DROP TABLE "_BuildingToOwner";

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
