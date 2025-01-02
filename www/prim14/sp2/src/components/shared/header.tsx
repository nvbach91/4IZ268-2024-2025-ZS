"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import "./header.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

export default function Header({
  homeLink,
  logoLink,
}: {
  homeLink: string;
  logoLink: string;
}) {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const router = useRouter();

  const handleSearch = () => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchValue) {
      searchParams.set("query", searchValue);
    } else {
      searchParams.delete("query");
    }

    router.replace(`?${searchParams.toString()}`);
  };

  return (
    <header>
      <Link href={homeLink}>
        <Card className="logo">
          <CardTitle className="name">
            <h1>Lišákův obchod</h1>
            <Image
              height={35.2}
              width={46.5}
              src={logoLink}
              alt="Logo obchůdku pana Lišáka"
              priority
            />
          </CardTitle>
        </Card>
      </Link>
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
        <Button onClick={handleSearch} title="Vyhledat">
          <FaSearch />
        </Button>
      </div>
    </header>
  );
}
