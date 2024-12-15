export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export default interface ApiResponse<T> extends BaseApiResponse {
  data: T;
}
