"use client";

import AdminContent from "@/components/content/AdminContent";
import Header from "@/components/shared/header";
import "./admin.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminProductContent from "@/components/content/AdminProductContent";

export default function Home() {
  const searchParams = useSearchParams();
  const [isProductForm, setIsProductForm] = useState(false);

  useEffect(() => {
    const form = searchParams.get("isProductForm");
    if (form == "1") setIsProductForm(true);
    else setIsProductForm(false);
  }, [searchParams]);

  return (
    <>
      <Header homeLink="../" logoLink="../logo-gray.webp" />
      <main>
        <div className="admin-wrapper">
          <div className="admin-wrapper__content">
            <h2>Administrace</h2>
            {isProductForm ? <AdminProductContent /> : <AdminContent />}
          </div>
        </div>
      </main>
    </>
  );
}
