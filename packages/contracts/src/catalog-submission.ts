import { z } from "zod";

export const LocationKindSchema = z.enum(["STANDALONE", "FOOD_TRUCK", "CANTEEN"]);

export type LocationKind = z.infer<typeof LocationKindSchema>;

export const VerificationStateSchema = z.enum(["unverified", "verified"]);

export type VerificationState = z.infer<typeof VerificationStateSchema>;

export const SubmitRestaurantWithFirstLocationInputSchema = z.object({
  firstLocation: z.object(
    {
      address: z.string().min(1).optional(),
      googleMapsUrl: z.url().optional(),
      kind: LocationKindSchema,
      name: z.string().min(1),
      websiteUrl: z.url().optional()
    },
    {
      error: "First Location is required."
    }
  ),
  restaurantName: z.string().min(1)
});

export type SubmitRestaurantWithFirstLocationInput = z.infer<
  typeof SubmitRestaurantWithFirstLocationInputSchema
>;

export const CatalogSubmissionConfirmationSchema = z.object({
  location: z.object({
    address: z.string().optional(),
    name: z.string()
  }),
  message: z.string(),
  restaurantName: z.string(),
  submissionId: z.uuid(),
  verificationState: VerificationStateSchema
});

export type CatalogSubmissionConfirmation = z.infer<typeof CatalogSubmissionConfirmationSchema>;
