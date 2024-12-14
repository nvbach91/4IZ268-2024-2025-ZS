import ProductsContent from "@/components/content/ProductsContent";
import Sidebar from "@/components/shared/sidebar";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Sidebar />
      <Suspense>
        <ProductsContent />
      </Suspense>
    </>
  );
}
