import { z } from "zod";

export const DistanceLabelSchema = z.object({
  label: z.string(),
  miles: z.number().nonnegative()
});

export const PublicCatalogRestaurantSchema = z.object({
  distance: DistanceLabelSchema.optional(),
  id: z.uuid(),
  location: z.object({
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    name: z.string()
  }),
  name: z.string(),
  urlHandle: z.string()
});

export const PublicCatalogRestaurantListResponseSchema = z.object({
  restaurants: z.array(PublicCatalogRestaurantSchema)
});

export type DistanceLabelDto = z.infer<typeof DistanceLabelSchema>;

export type PublicCatalogRestaurantDto = z.infer<typeof PublicCatalogRestaurantSchema>;

export type PublicCatalogRestaurantListResponse = z.infer<
  typeof PublicCatalogRestaurantListResponseSchema
>;
