import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import IProduct from "@/models/IProduct";
import { getProducts } from "@/services/productsService";

const useProducts = (searchParams: URLSearchParams) => {
  const { sendRequest } = useFetch();
  const [products, setProducts] = useState<IProduct[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(10);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>();

  const refreshProducts = async () => {
    setProducts(undefined);
    await fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res = await sendRequest(getProducts, searchParams);
    if (res.success) {
      setProducts(res.data.items);
      setCurrentPage(res.data.currentPage);
      setTotalRecords(res.data.totalRecords);
      setPageSize(10);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  return {
    products,
    currentPage,
    totalRecords,
    pageSize,
    loading,
    refreshProducts,
  };
};

export default useProducts;
