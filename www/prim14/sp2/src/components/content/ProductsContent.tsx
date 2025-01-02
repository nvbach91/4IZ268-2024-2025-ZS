"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./productsContent.css";
import useProducts from "@/hooks/useProducts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import ILookup from "@/models/ILookup";
import { Skeleton } from "../ui/skeleton";

export default function ProductsContent({
  availabilities,
  conditions,
}: {
  availabilities?: Array<ILookup>;
  conditions?: Array<ILookup>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, loading, totalRecords, pageSize, currentPage } =
    useProducts(searchParams);

  const handleChangePage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page.toString());
    router.replace(`?${searchParams.toString()}`);
  };

  return (
    <div className="products-content">
      <h2>Produkty v nabídce</h2>
      <div className="products-content__list">
        {products && !loading
          ? products.map((p) => (
              <Card key={p._id} className="product-card">
                <CardHeader>
                  <CardTitle className="text-md">{p.name}</CardTitle>
                  <CardDescription>{p.price} Kč</CardDescription>
                </CardHeader>
                <CardContent className="product-card__image-wrapper">
                  <Image
                    src={p.imagePath}
                    alt={p.name}
                    width={300}
                    height={200}
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                  <span className="font-bold">
                    {availabilities &&
                      availabilities.find((a) => a._id === p.availability)
                        ?.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {conditions &&
                      conditions.find((c) => c._id === p.condition)?.label}
                  </span>
                </CardFooter>
              </Card>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="product-card">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="product-card__image-wrapper">
                  <Skeleton className="h-[150px] w-full" />
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardFooter>
              </Card>
            ))}
      </div>
      <div className="w-full">
        {products && products.length > 0 && !loading && totalRecords && (
          <Pagination>
            <PaginationContent>
              {Array.from({
                length: Math.ceil(totalRecords / pageSize),
              }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handleChangePage(index + 1)}
                    isActive={currentPage === index + 1}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
