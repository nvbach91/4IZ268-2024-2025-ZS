import { BaseApiResponse } from "@/models/BaseApiResponse";
import { API_KEY, API_URL } from "./apiConfig";

export async function fetchAuthorized<Res extends BaseApiResponse>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown,
  cache: boolean = false
): Promise<Res> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-token": API_KEY,
  };

  const cacheControl = cache ? "force-cache" : "no-store";

  const response = await fetch(API_URL + url, {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
    cache: cacheControl,
  });

  if (response.status === 401)
    return {
      success: false,
      message: "Unauthorized",
    } as Res;

  return response.json();
}
