"use client";

import SingleProductContent from "@/components/content/SingleProductContent";
import Header from "@/components/shared/header";
import SidebarProductDetail from "@/components/shared/sidebarProductDetail";
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
      <Header homeLink="../" logoLink="../logo-gray.webp" />
      <main>
        <SidebarProductDetail />
        {productId && (
          <SingleProductContent
            productId={productId}
            conditions={conditions}
            availabilities={availabilities}
          />
        )}
      </main>
    </>
  );
}
