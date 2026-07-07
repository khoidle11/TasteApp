import { z } from "zod";

export const LocationKindSchema = z.enum(["STANDALONE", "FOOD_TRUCK", "CANTEEN"]);

export type LocationKind = z.infer<typeof LocationKindSchema>;

export const VerificationStateSchema = z.enum(["unverified", "verified"]);

export type VerificationState = z.infer<typeof VerificationStateSchema>;

const OptionalTrimmedUrlSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.url().optional()
);

export const SubmitRestaurantWithFirstLocationInputSchema = z
  .object({
    firstLocation: z.object(
      {
        address: z.string().trim().min(1).optional(),
        googleMapsUrl: OptionalTrimmedUrlSchema,
        kind: LocationKindSchema,
        name: z.string().trim().min(1, { error: "Location name is required." }),
        websiteUrl: OptionalTrimmedUrlSchema
      },
      {
        error: "First Location is required."
      }
    ),
    restaurantName: z.string().trim().min(1, { error: "Restaurant name is required." })
  })
  .superRefine((input, context) => {
    if (input.firstLocation.kind !== "FOOD_TRUCK" && !input.firstLocation.address) {
      context.addIssue({
        code: "custom",
        message: "Address is required unless this is a Food Truck.",
        path: ["firstLocation", "address"]
      });
    }
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
