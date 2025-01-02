"use client";

import useSingleProduct from "@/hooks/useSingleProduct";
import ILookup from "@/models/ILookup";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export default function SingleProductContent({
  availabilities,
  conditions,
  productId,
}: {
  availabilities?: Array<ILookup>;
  conditions?: Array<ILookup>;
  productId: string;
}) {
  const { product, loading } = useSingleProduct(productId);
  return (
    <div className="products-content">
      {product && !loading ? (
        <>
          <h2>{product.name}</h2>
          <Card className="product-card">
            <CardHeader></CardHeader>
            <CardContent className="product-card__image-wrapper">
              <Image
                src={product.imagePath}
                alt={product.name}
                width={300}
                height={200}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <div className="text-xl">{product.price} Kč</div>
              <span className="font-bold mt-2">
                {availabilities &&
                  availabilities.find((a) => a._id === product.availability)
                    ?.label}
              </span>
              <span className="text-sm text-gray-500">
                {conditions &&
                  conditions.find((c) => c._id === product.condition)?.label}
              </span>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
