-- CreateTable
CREATE TABLE "tax" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL,
    "invoice" TEXT NOT NULL,
    "quote" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appearence" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "appearence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owner" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "actionnary" TEXT NOT NULL,
    "properties" TEXT NOT NULL,
    "bankInfo" TEXT NOT NULL,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "entry" TEXT NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "familialSituation" TEXT NOT NULL,
    "bankInfo" TEXT NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);
