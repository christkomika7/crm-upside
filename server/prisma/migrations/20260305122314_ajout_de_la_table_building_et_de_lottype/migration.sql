-- CreateTable
CREATE TABLE "building" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "constructionDate" TIMESTAMP(3) NOT NULL,
    "lotType" TEXT NOT NULL,
    "door" INTEGER NOT NULL,
    "parkingPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "security" BOOLEAN NOT NULL DEFAULT false,
    "camera" BOOLEAN NOT NULL DEFAULT false,
    "elevator" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "generator" BOOLEAN NOT NULL DEFAULT false,
    "waterBorehole" BOOLEAN NOT NULL DEFAULT false,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "garden" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT[],
    "map" TEXT NOT NULL,
    "photos" TEXT[],
    "deeds" TEXT[],
    "documents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lot_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lot_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuildingToLotType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BuildingToLotType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BuildingToLotType_B_index" ON "_BuildingToLotType"("B");

-- AddForeignKey
ALTER TABLE "_BuildingToLotType" ADD CONSTRAINT "_BuildingToLotType_A_fkey" FOREIGN KEY ("A") REFERENCES "building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuildingToLotType" ADD CONSTRAINT "_BuildingToLotType_B_fkey" FOREIGN KEY ("B") REFERENCES "lot_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
