"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import "./header.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const router = useRouter();

  const handleSearch = () => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchValue) {
      searchParams.set("q", searchValue);
    } else {
      searchParams.delete("q");
    }

    router.replace(`?${searchParams.toString()}`);
  };

  return (
    <header>
      <Card className="logo">
        <CardTitle className="name">
          <h1>Lišákův obchod</h1>
          <Image
            height={35.2}
            width={46.5}
            src="./logo-gray.webp"
            alt="Logo obchůdku Petra Lišáka"
          />
        </CardTitle>
      </Card>
      <div className="search-bar">
        <Input
          type="search"
          placeholder="Vyhledávání..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>Hledat</Button>
      </div>
    </header>
  );
}
