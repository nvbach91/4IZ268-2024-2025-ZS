import { fetchAuthorized } from "./requestHelpers";
import { ApiResponse } from "@/models/BaseApiResponse";
import IProduct from "@/models/IProduct";
import { PagedList } from "@/utils/PagedList";

const path = "/products";

export const getProducts = async (searchParams: URLSearchParams) => {
  return await fetchAuthorized<ApiResponse<PagedList<IProduct>>>(
    "GET",
    path + "?" + searchParams.toString()
  );
};

export const getProductById = async (id: string) => {
  return await fetchAuthorized<ApiResponse<IProduct>>("GET", path + "/" + id);
};

export const createProduct = async (product: IProduct) => {
  return await fetchAuthorized<ApiResponse<IProduct>>("POST", path, product);
};

export const updateProduct = async (product: IProduct) => {
  return await fetchAuthorized<ApiResponse<IProduct>>("PUT", path, product);
};

export const deleteProduct = async (id: string) => {
  return await fetchAuthorized<ApiResponse<IProduct>>(
    "DELETE",
    path + "/" + id
  );
};
