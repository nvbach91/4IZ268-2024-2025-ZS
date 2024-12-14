"use client";

import { useSearchParams } from "next/navigation";
import "./productsContent.css";
import { useEffect, useState } from "react";

export default function ProductsContent() {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  return <div className="products-content">{value}</div>;
}
