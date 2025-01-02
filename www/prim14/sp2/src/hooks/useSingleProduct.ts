import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import IProduct from "@/models/IProduct";
import { getProductById } from "@/services/productsService";

const useSingleProduct = (productId: string) => {
  const { sendRequest } = useFetch();
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState<boolean>();

  const fetchProduct = async () => {
    setLoading(true);
    const res = await sendRequest(getProductById, productId);
    if (res.success) {
      setProduct(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
  };
};

export default useSingleProduct;
