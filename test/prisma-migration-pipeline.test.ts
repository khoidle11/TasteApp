import { readFileSync } from "node:fs";
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
    expect(ciWorkflow.indexOf("pnpm run db:migrate:deploy")).toBeLessThan(
      ciWorkflow.indexOf("pnpm run test")
    );

    expect(deployWorkflow).toContain("pnpm run db:migrate:deploy");
    expect(deployWorkflow).toContain("test -f prisma/schema.prisma");
    expect(deployWorkflow).toContain("github.ref != 'refs/heads/main'");
    expect(deployWorkflow).toContain("Deployment workflows may only run from refs/heads/main.");
    expect(deployWorkflow).toContain("github.ref == 'refs/heads/main'");

    expect(deliveryWorkflow).toContain("prisma migrate dev --name <name>");
    expect(deliveryWorkflow).toContain("committed for review");
    expect(deliveryWorkflow).toContain("CI verifies committed migrations");
    expect(deliveryWorkflow).toContain("CD applies committed migrations");

    const pipelineCommands = [ciWorkflow, deployWorkflow].join("\n");

    expect(pipelineCommands).not.toMatch(/\bprisma migrate dev\b/);
    expect(pipelineCommands).not.toMatch(/\bprisma migrate reset\b/);
    expect(pipelineCommands).not.toMatch(/\bprisma studio\b/);
  });
});
