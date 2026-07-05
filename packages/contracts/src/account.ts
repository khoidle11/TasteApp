import { z } from "zod";

export const TasteAppUserDtoSchema = z.object({
  displayName: z.string().nullable(),
  id: z.uuid(),
  primaryEmail: z.email().nullable()
});

export type TasteAppUserDto = z.infer<typeof TasteAppUserDtoSchema>;

export const CurrentTasteAppUserResponseSchema = z.object({
  user: TasteAppUserDtoSchema
});

export type CurrentTasteAppUserResponse = z.infer<typeof CurrentTasteAppUserResponseSchema>;
