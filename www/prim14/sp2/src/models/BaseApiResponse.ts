export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface ApiResponse<T> extends BaseApiResponse {
  data: T;
}
