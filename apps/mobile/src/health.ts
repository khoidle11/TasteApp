import { HealthResponseSchema, type HealthResponse } from "@tasteapp/contracts";

export function getMobileHealthStatus(): HealthResponse {
  return HealthResponseSchema.parse({
    service: "tasteapp",
    status: "ok"
  });
}
