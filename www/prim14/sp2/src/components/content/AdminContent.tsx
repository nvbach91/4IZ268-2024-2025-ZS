"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import "./adminContent.css";
import useProducts from "@/hooks/useProducts";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import useFetch from "@/hooks/useFetch";
import { deleteProduct } from "@/services/productsService";
import { Skeleton } from "../ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";

export default function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendAuditableRequest } = useFetch();
  const {
    products,
    refreshProducts,
    loading,
    totalRecords,
    pageSize,
    currentPage,
  } = useProducts(searchParams);

  const handleDeleteProduct = async (id: string) => {
    const res = await sendAuditableRequest(deleteProduct, id);
    if (res.success) {
      await refreshProducts();
    }
  };

  const handleChangePage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page.toString());
    router.replace(`?${searchParams.toString()}`);
  };

  return (
    <div className="admin-overview">
      <div className="w-full flex justify-end">
        <Button onClick={() => router.push("./admin/product")}>
          Přidat produkt
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Produkt</TableHead>
            <TableHead>Cena</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products && !loading
            ? products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-bold">{product.name}</TableCell>
                  <TableCell>{product.price},- Kč</TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Button
                      onClick={() =>
                        router.push("./admin/product?id=" + product._id)
                      }
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product._id!)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-10" />
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="w-full">
        {products && !loading && totalRecords && (
          <Pagination>
            <PaginationContent>
              {Array.from({ length: Math.ceil(totalRecords / pageSize) }).map(
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handleChangePage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
