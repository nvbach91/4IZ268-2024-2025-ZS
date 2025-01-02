import { BaseApiResponse } from "@/models/BaseApiResponse";
import { API_KEY, API_URL } from "./apiConfig";

export async function fetchAuthorized<Res extends BaseApiResponse>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown
): Promise<Res> {
  const response = await fetch(API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "x-api-token": API_KEY,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 401)
    return {
      success: false,
      message: "Unauthorized",
    } as Res;

  return response.json();
}
