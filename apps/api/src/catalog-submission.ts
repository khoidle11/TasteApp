import {
  SubmitRestaurantWithFirstLocationInputSchema,
  type CatalogSubmissionConfirmation,
  type SubmitRestaurantWithFirstLocationInput,
  type VerificationState
} from "@tasteapp/contracts";

export type Submitter = {
  id: string;
};

export type PublicCatalogRestaurant = {
  id: string;
  name: string;
  urlHandle: string;
};

export type CatalogSubmissionRepository = {
  createRestaurantWithFirstLocation(
    input: SubmitRestaurantWithFirstLocationInput,
    submitter: Submitter
  ): Promise<{ submissionId: string }>;
  listPublicRestaurants(): Promise<PublicCatalogRestaurant[]>;
};

export class CatalogSubmissionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogSubmissionValidationError";
  }
}

type StoredCatalogSubmission = {
  input: SubmitRestaurantWithFirstLocationInput;
  submissionId: string;
  submitter: Submitter;
  verificationState: VerificationState;
};

export class InMemoryCatalogSubmissionRepository implements CatalogSubmissionRepository {
  private readonly submissions: StoredCatalogSubmission[] = [];

  createRestaurantWithFirstLocation(
    input: SubmitRestaurantWithFirstLocationInput,
    submitter: Submitter
  ): Promise<{ submissionId: string }> {
    const submissionId = `00000000-0000-4000-8000-${String(this.submissions.length + 1).padStart(12, "0")}`;

    this.submissions.push({
      input,
      submissionId,
      submitter,
      verificationState: "unverified"
    });

    return Promise.resolve({ submissionId });
  }

  listPublicRestaurants(): Promise<PublicCatalogRestaurant[]> {
    return Promise.resolve(
      this.submissions
        .filter((submission) => submission.verificationState === "verified")
        .map((submission) => ({
          id: submission.submissionId,
          name: submission.input.restaurantName,
          urlHandle: toRestaurantUrlHandle(submission.input.restaurantName)
        }))
    );
  }
}

export async function submitRestaurantWithFirstLocation(
  untrustedInput: unknown,
  submitter: Submitter,
  repository: CatalogSubmissionRepository
): Promise<CatalogSubmissionConfirmation> {
  const parsedInput = SubmitRestaurantWithFirstLocationInputSchema.safeParse(untrustedInput);

  if (!parsedInput.success) {
    throw new CatalogSubmissionValidationError(
      parsedInput.error.issues[0]?.message ?? "Catalog submission is invalid."
    );
  }

  const input = parsedInput.data;
  const submission = await repository.createRestaurantWithFirstLocation(input, submitter);

  return {
    location: {
      address: input.firstLocation.address,
      name: input.firstLocation.name
    },
    message: "Thanks, we'll review this before it appears in TasteApp.",
    restaurantName: input.restaurantName,
    submissionId: submission.submissionId,
    verificationState: "unverified"
  };
}

export function listPublicCatalogRestaurants(
  repository: CatalogSubmissionRepository
): Promise<PublicCatalogRestaurant[]> {
  return repository.listPublicRestaurants();
}

export function toRestaurantUrlHandle(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nextRestaurantUrlHandle(restaurantName: string, existingHandles: string[]): string {
  const baseHandle = toRestaurantUrlHandle(restaurantName);
  const usedHandles = new Set(existingHandles);

  if (!usedHandles.has(baseHandle)) {
    return baseHandle;
  }

  let suffix = 2;
  let candidate = `${baseHandle}-${String(suffix)}`;

  while (usedHandles.has(candidate)) {
    suffix += 1;
    candidate = `${baseHandle}-${String(suffix)}`;
  }

  return candidate;
}
