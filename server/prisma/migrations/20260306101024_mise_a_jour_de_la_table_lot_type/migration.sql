/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `lot_type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lot_type_name_key" ON "lot_type"("name");
