import {
  HealthResponseSchema,
  ReadinessResponseSchema,
  type HealthResponse,
  type ReadinessCheck,
  type ReadinessResponse
} from "@tasteapp/contracts";

export function getHealthResponse(): HealthResponse {
  return HealthResponseSchema.parse({
    service: "tasteapp",
    status: "ok"
  });
}

export function getReadinessResponse(checks: ReadinessCheck[] = []): ReadinessResponse {
  return ReadinessResponseSchema.parse({
    checks,
    ready: checks.every((check) => check.status === "ok"),
    service: "tasteapp"
  });
}
