-- CreateTable
CREATE TABLE "tasteapp_users" (
    "id" UUID NOT NULL,
    "displayName" TEXT,
    "primaryEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasteapp_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_auth_identities" (
    "id" UUID NOT NULL,
    "tasteAppUserId" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "providerSubject" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "external_auth_identities_tasteAppUserId_idx" ON "external_auth_identities"("tasteAppUserId");

-- CreateIndex
CREATE UNIQUE INDEX "external_auth_identities_provider_providerSubject_key" ON "external_auth_identities"("provider", "providerSubject");

-- AddForeignKey
ALTER TABLE "external_auth_identities" ADD CONSTRAINT "external_auth_identities_tasteAppUserId_fkey" FOREIGN KEY ("tasteAppUserId") REFERENCES "tasteapp_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
