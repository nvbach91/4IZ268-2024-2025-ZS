"use client";

import ProductsContent from "@/components/content/ProductsContent";
import Header from "@/components/shared/header";
import Sidebar from "@/components/shared/sidebar";
import useAvailabilityLookups from "@/hooks/useAvailabilityLookups";
import useConditionLookups from "@/hooks/useConditionLookups";

export default function Home() {
  const { conditions } = useConditionLookups();
  const { availabilities } = useAvailabilityLookups();

  return (
    <>
      <Header homeLink="./" logoLink="./logo-gray.webp" />
      <main>
        <Sidebar conditions={conditions} availabilities={availabilities} />
        <ProductsContent
          conditions={conditions}
          availabilities={availabilities}
        />
      </main>
    </>
  );
}
