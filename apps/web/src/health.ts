import { HealthResponseSchema, type HealthResponse } from "@tasteapp/contracts";

export function getWebHealthStatus(): HealthResponse {
  return HealthResponseSchema.parse({
    service: "tasteapp",
    status: "ok"
  });
}
