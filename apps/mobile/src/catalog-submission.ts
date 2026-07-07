import type { LocationKind, SubmitRestaurantWithFirstLocationInput } from "@tasteapp/contracts";

export type MobileCatalogSubmissionForm = {
  address: string;
  googleMapsUrl: string;
  locationKind: LocationKind;
  locationName: string;
  restaurantName: string;
  websiteUrl: string;
};

export function createEmptyCatalogSubmissionForm(): MobileCatalogSubmissionForm {
  return {
    address: "",
    googleMapsUrl: "",
    locationKind: "STANDALONE",
    locationName: "",
    restaurantName: "",
    websiteUrl: ""
  };
}

export function buildCatalogSubmissionPayload(
  form: MobileCatalogSubmissionForm
): SubmitRestaurantWithFirstLocationInput {
  const restaurantName = form.restaurantName.trim();
  const locationName = form.locationName.trim();
  const address = form.address.trim();
  const googleMapsUrl = form.googleMapsUrl.trim();
  const websiteUrl = form.websiteUrl.trim();

  if (!restaurantName) {
    throw new Error("Restaurant name is required.");
  }

  if (!locationName) {
    throw new Error("Location name is required.");
  }

  if (form.locationKind !== "FOOD_TRUCK" && !address) {
    throw new Error("Address is required unless this is a Food Truck.");
  }

  return {
    firstLocation: {
      ...(address ? { address } : {}),
      ...(googleMapsUrl ? { googleMapsUrl } : {}),
      kind: form.locationKind,
      name: locationName,
      ...(websiteUrl ? { websiteUrl } : {})
    },
    restaurantName
  };
}
