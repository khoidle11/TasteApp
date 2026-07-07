-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "submissionFingerprint" TEXT,
ADD COLUMN     "submissionFingerprintBucket" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_submittedByTasteAppUserId_submissionFingerprint_key" ON "restaurants"("submittedByTasteAppUserId", "submissionFingerprint", "submissionFingerprintBucket");

