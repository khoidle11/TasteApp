import { z } from "zod";

export const HealthResponseSchema = z.object({
  service: z.literal("tasteapp"),
  status: z.literal("ok")
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ReadinessCheckSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["ok", "unavailable"])
});

export type ReadinessCheck = z.infer<typeof ReadinessCheckSchema>;

export const ReadinessResponseSchema = z.object({
  checks: z.array(ReadinessCheckSchema),
  ready: z.boolean(),
  service: z.literal("tasteapp")
});

export type ReadinessResponse = z.infer<typeof ReadinessResponseSchema>;
