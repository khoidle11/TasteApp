import { readFileSync } from "node:fs";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();

function readRepositoryFile(path: string): string {
  return readFileSync(join(repositoryRoot, path), "utf8");
}

describe("Prisma migration pipeline", () => {
  it("defines scripts and CI/CD steps for committed migrations without destructive pipeline commands", () => {
    const packageJson = JSON.parse(readRepositoryFile("package.json")) as {
      scripts: Record<string, string>;
    };
    const ciWorkflow = readRepositoryFile(".github/workflows/ci.yml");
    const deployWorkflow = readRepositoryFile(".github/workflows/deploy.yml");
    const deliveryWorkflow = readRepositoryFile("docs/delivery/workflow.md");

    expect(packageJson.scripts).toMatchObject({
      "db:generate": "prisma generate --schema prisma/schema.prisma",
      "db:migrate:deploy": "prisma migrate deploy --schema prisma/schema.prisma"
    });

    expect(ciWorkflow).toContain("postgres:");
    expect(ciWorkflow).toContain("DATABASE_URL:");
    expect(ciWorkflow).toContain("test -f prisma/schema.prisma");
    expect(ciWorkflow).toContain("pnpm run db:generate");
    expect(ciWorkflow).toContain("pnpm run db:migrate:deploy");
    expect(ciWorkflow).toContain('TASTEAPP_RUN_DB_INTEGRATION_TESTS: "1"');
    expect(ciWorkflow).toContain("pnpm --filter @tasteapp/api test");
    expect(ciWorkflow.indexOf("- name: Apply committed Prisma migrations")).toBeLessThan(
      ciWorkflow.indexOf("- name: Test")
    );
    expect(ciWorkflow.indexOf("- name: Apply committed Prisma migrations")).toBeLessThan(
      ciWorkflow.indexOf("- name: Database integration tests")
    );

    expect(deployWorkflow).toContain("pnpm run db:migrate:deploy");
    expect(deployWorkflow).toContain("test -f prisma/schema.prisma");
    expect(deployWorkflow).toContain("github.ref != 'refs/heads/main'");
    expect(deployWorkflow).toContain("Deployment workflows may only run from refs/heads/main.");
    expect(deployWorkflow).toContain("github.ref == 'refs/heads/main'");

    expect(deliveryWorkflow).toContain("prisma migrate dev --name <name>");
    expect(deliveryWorkflow).toContain("committed for review");
    expect(deliveryWorkflow).toContain("CI verifies committed migrations");
    expect(deliveryWorkflow).toContain("runs the narrow API database integration tests");
    expect(deliveryWorkflow).toContain("CD applies committed migrations");

    const pipelineCommands = [ciWorkflow, deployWorkflow].join("\n");

    expect(pipelineCommands).not.toMatch(/\bprisma migrate dev\b/);
    expect(pipelineCommands).not.toMatch(/\bprisma migrate reset\b/);
    expect(pipelineCommands).not.toMatch(/\bprisma studio\b/);
  });

  it("defines committed Prisma models for local TasteApp User account mapping", () => {
    const schema = readRepositoryFile("prisma/schema.prisma");
    const migrationsPath = join(repositoryRoot, "prisma/migrations");
    const migrationDirectories = readdirSync(migrationsPath).filter((entry) =>
      existsSync(join(migrationsPath, entry, "migration.sql"))
    );
    const migrationSql = migrationDirectories
      .map((entry) => readRepositoryFile(`prisma/migrations/${entry}/migration.sql`))
      .join("\n");

    expect(schema).toContain("model TasteAppUser");
    expect(schema).toContain("model ExternalAuthIdentity");
    expect(schema).toContain('@@map("tasteapp_users")');
    expect(schema).toContain("@@unique([provider, providerSubject])");
    expect(migrationSql).toContain('CREATE TABLE "tasteapp_users"');
    expect(migrationSql).toContain('CREATE TABLE "external_auth_identities"');
  });

  it("defines committed Prisma models for user-submitted Restaurants and Locations", () => {
    const schema = readRepositoryFile("prisma/schema.prisma");
    const migrationsPath = join(repositoryRoot, "prisma/migrations");
    const migrationDirectories = readdirSync(migrationsPath).filter((entry) =>
      existsSync(join(migrationsPath, entry, "migration.sql"))
    );
    const migrationSql = migrationDirectories
      .map((entry) => readRepositoryFile(`prisma/migrations/${entry}/migration.sql`))
      .join("\n");

    expect(schema).toContain("model Restaurant");
    expect(schema).toContain("model Location");
    expect(schema).toContain("enum VerificationState");
    expect(schema).toContain("enum LocationKind");
    expect(schema).toContain("enum CatalogRecordSource");
    expect(schema).toContain("submissionFingerprint");
    expect(schema).toContain("submissionFingerprintBucket");
    expect(schema).toContain("latitude");
    expect(schema).toContain("longitude");
    expect(schema).toContain('@@map("restaurants")');
    expect(schema).toContain('@@map("locations")');
    expect(schema).toContain(
      "@@unique([submittedByTasteAppUserId, submissionFingerprint, submissionFingerprintBucket])"
    );
    expect(migrationSql).toContain('CREATE TABLE "restaurants"');
    expect(migrationSql).toContain('CREATE TABLE "locations"');
    expect(migrationSql).toContain('CREATE TYPE "VerificationState"');
    expect(migrationSql).toContain('CREATE TYPE "LocationKind"');
    expect(migrationSql).toContain('"submissionFingerprint" TEXT');
    expect(migrationSql).toContain('"submissionFingerprintBucket" TEXT');
    expect(migrationSql).toContain('"latitude" DOUBLE PRECISION');
    expect(migrationSql).toContain('"longitude" DOUBLE PRECISION');
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX "restaurants_submittedByTasteAppUserId_submissionFingerprint_key"'
    );
  });

  it("defines committed Prisma models for cached geocoding results", () => {
    const schema = readRepositoryFile("prisma/schema.prisma");
    const migrationsPath = join(repositoryRoot, "prisma/migrations");
    const migrationDirectories = readdirSync(migrationsPath).filter((entry) =>
      existsSync(join(migrationsPath, entry, "migration.sql"))
    );
    const migrationSql = migrationDirectories
      .map((entry) => readRepositoryFile(`prisma/migrations/${entry}/migration.sql`))
      .join("\n");

    expect(schema).toContain("model GeocodingCacheEntry");
    expect(schema).toContain("providerId");
    expect(schema).toContain("normalizedQuery");
    expect(schema).toContain("providerPlaceId");
    expect(schema).toContain("@@unique([providerId, normalizedQuery])");
    expect(schema).toContain('@@map("geocoding_cache_entries")');
    expect(migrationSql).toContain('CREATE TABLE "geocoding_cache_entries"');
    expect(migrationSql).toContain('"providerId" TEXT NOT NULL');
    expect(migrationSql).toContain('"normalizedQuery" TEXT NOT NULL');
    expect(migrationSql).toContain(
      'CREATE UNIQUE INDEX "geocoding_cache_entries_providerId_normalizedQuery_key"'
    );
  });
});
