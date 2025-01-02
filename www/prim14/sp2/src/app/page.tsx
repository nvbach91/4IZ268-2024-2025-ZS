"use client";

import ProductsContent from "@/components/content/ProductsContent";
import SingleProductContent from "@/components/content/SingleProductContent";
import Header from "@/components/shared/header";
import Sidebar from "@/components/shared/sidebar";
import useAvailabilityLookups from "@/hooks/useAvailabilityLookups";
import useConditionLookups from "@/hooks/useConditionLookups";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const { conditions } = useConditionLookups();
  const { availabilities } = useAvailabilityLookups();
  const [productId, setProductId] = useState<string | null>();

  useEffect(() => {
    const pId = searchParams.get("productId");
    setProductId(pId);
  }, [searchParams]);

  return (
    <>
      <Header homeLink="./" logoLink="./logo-gray.webp" />
      <main>
        <Sidebar conditions={conditions} availabilities={availabilities} />
        {productId ? (
          <SingleProductContent
            productId={productId}
            conditions={conditions}
            availabilities={availabilities}
          />
        ) : (
          <ProductsContent
            conditions={conditions}
            availabilities={availabilities}
          />
        )}
      </main>
    </>
  );
}
