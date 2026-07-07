import { createHash } from "node:crypto";

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
    submitter: Submitter,
    submissionFingerprint: string,
    submissionFingerprintBucket: string
  ): Promise<{ submissionId: string }>;
  findRecentRestaurantWithFirstLocationSubmission(
    submitter: Submitter,
    submissionFingerprint: string,
    submittedAfter: Date
  ): Promise<{ submissionId: string } | null>;
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
  submissionFingerprint: string;
  submissionFingerprintBucket: string;
  submissionId: string;
  submitter: Submitter;
  submittedAt: Date;
  verificationState: VerificationState;
};

export class InMemoryCatalogSubmissionRepository implements CatalogSubmissionRepository {
  private readonly submissions: StoredCatalogSubmission[] = [];

  createRestaurantWithFirstLocation(
    input: SubmitRestaurantWithFirstLocationInput,
    submitter: Submitter,
    submissionFingerprint: string,
    submissionFingerprintBucket: string
  ): Promise<{ submissionId: string }> {
    const submissionId = `00000000-0000-4000-8000-${String(this.submissions.length + 1).padStart(12, "0")}`;

    this.submissions.push({
      input,
      submissionFingerprint,
      submissionFingerprintBucket,
      submissionId,
      submitter,
      submittedAt: new Date(),
      verificationState: "unverified"
    });

    return Promise.resolve({ submissionId });
  }

  findRecentRestaurantWithFirstLocationSubmission(
    submitter: Submitter,
    submissionFingerprint: string,
    submittedAfter: Date
  ): Promise<{ submissionId: string } | null> {
    const matchingSubmission = this.submissions.find(
      (submission) =>
        submission.submittedAt >= submittedAfter &&
        submission.submitter.id === submitter.id &&
        submission.submissionFingerprint === submissionFingerprint
    );

    return Promise.resolve(
      matchingSubmission ? { submissionId: matchingSubmission.submissionId } : null
    );
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
  const submissionFingerprint = catalogSubmissionFingerprint(input);
  const submissionFingerprintBucket = catalogSubmissionFingerprintBucket();
  const recentDuplicateSubmission =
    await repository.findRecentRestaurantWithFirstLocationSubmission(
      submitter,
      submissionFingerprint,
      recentDuplicateWindowStart()
    );
  const submission =
    recentDuplicateSubmission ??
    (await repository.createRestaurantWithFirstLocation(
      input,
      submitter,
      submissionFingerprint,
      submissionFingerprintBucket
    ));

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

function recentDuplicateWindowStart(): Date {
  return new Date(Date.now() - catalogSubmissionDeduplicationWindowMs);
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

export function nextRestaurantUrlHandle(
  restaurantName: string,
  existingHandles: string[],
  fallbackId: string
): string {
  const readableHandle = toRestaurantUrlHandle(restaurantName);
  const baseHandle = readableHandle || `restaurant-${fallbackId.replace(/-/g, "").slice(-12)}`;
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

export function catalogSubmissionFingerprint(
  input: SubmitRestaurantWithFirstLocationInput
): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        firstLocation: {
          address: input.firstLocation.address ?? null,
          googleMapsUrl: input.firstLocation.googleMapsUrl ?? null,
          kind: input.firstLocation.kind,
          name: input.firstLocation.name,
          websiteUrl: input.firstLocation.websiteUrl ?? null
        },
        restaurantName: input.restaurantName
      })
    )
    .digest("hex");
}

const catalogSubmissionDeduplicationWindowMs = 5 * 60 * 1000;

export function catalogSubmissionFingerprintBucket(date = new Date()): string {
  return String(Math.floor(date.getTime() / catalogSubmissionDeduplicationWindowMs));
}
