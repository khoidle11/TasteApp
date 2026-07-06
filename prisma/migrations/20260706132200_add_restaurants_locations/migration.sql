-- CreateEnum
CREATE TYPE "VerificationState" AS ENUM ('unverified', 'verified');

-- CreateEnum
CREATE TYPE "LocationKind" AS ENUM ('STANDALONE', 'FOOD_TRUCK', 'CANTEEN');

-- CreateEnum
CREATE TYPE "CatalogRecordSource" AS ENUM ('USER', 'ADMIN', 'SEED', 'SYSTEM');

-- CreateTable
CREATE TABLE "restaurants" (
    "id" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "urlHandle" TEXT NOT NULL,
    "verificationState" "VerificationState" NOT NULL DEFAULT 'unverified',
    "createdByKind" "CatalogRecordSource" NOT NULL DEFAULT 'USER',
    "submittedByTasteAppUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "restaurantId" UUID NOT NULL,
    "kind" "LocationKind" NOT NULL,
    "displayName" TEXT NOT NULL,
    "address" TEXT,
    "googleMapsUrl" TEXT,
    "websiteUrl" TEXT,
    "serviceArea" TEXT,
    "verificationState" "VerificationState" NOT NULL DEFAULT 'unverified',
    "createdByKind" "CatalogRecordSource" NOT NULL DEFAULT 'USER',
    "submittedByTasteAppUserId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_urlHandle_key" ON "restaurants"("urlHandle");

-- CreateIndex
CREATE INDEX "restaurants_verificationState_idx" ON "restaurants"("verificationState");

-- CreateIndex
CREATE INDEX "restaurants_submittedByTasteAppUserId_idx" ON "restaurants"("submittedByTasteAppUserId");

-- CreateIndex
CREATE INDEX "locations_restaurantId_idx" ON "locations"("restaurantId");

-- CreateIndex
CREATE INDEX "locations_verificationState_idx" ON "locations"("verificationState");

-- CreateIndex
CREATE INDEX "locations_submittedByTasteAppUserId_idx" ON "locations"("submittedByTasteAppUserId");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_submittedByTasteAppUserId_fkey" FOREIGN KEY ("submittedByTasteAppUserId") REFERENCES "tasteapp_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_submittedByTasteAppUserId_fkey" FOREIGN KEY ("submittedByTasteAppUserId") REFERENCES "tasteapp_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

