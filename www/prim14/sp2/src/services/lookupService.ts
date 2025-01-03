import ILookup from "@/models/ILookup";
import { fetchAuthorized } from "./requestHelpers";
import { ApiResponse } from "@/models/BaseApiResponse";

const path = "/lookup";

export const getAvailabilityLookups = async () => {
  return await fetchAuthorized<ApiResponse<ILookup[]>>(
    "GET",
    `${path}?type=availability`,
    undefined,
    true
  );
};

export const getConditionLookups = async () => {
  return await fetchAuthorized<ApiResponse<ILookup[]>>(
    "GET",
    `${path}?type=condition`,
    undefined,
    true
  );
};
