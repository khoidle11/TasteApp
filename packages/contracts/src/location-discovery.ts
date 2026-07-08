import { z } from "zod";

export const DeviceSearchLocationInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  source: z.literal("device")
});

export const TypedSearchLocationInputSchema = z.object({
  query: z.string().trim().min(1, { error: "Search Location is required." }),
  source: z.literal("typed")
});

export const SearchLocationInputSchema = z.discriminatedUnion("source", [
  DeviceSearchLocationInputSchema,
  TypedSearchLocationInputSchema
]);

export type DeviceSearchLocationInput = z.infer<typeof DeviceSearchLocationInputSchema>;

export type TypedSearchLocationInput = z.infer<typeof TypedSearchLocationInputSchema>;

export type SearchLocationInput = z.infer<typeof SearchLocationInputSchema>;
