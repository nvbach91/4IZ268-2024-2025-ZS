"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import "./header.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    router.push(`./?search=${encodeURIComponent(searchValue)}`);
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
