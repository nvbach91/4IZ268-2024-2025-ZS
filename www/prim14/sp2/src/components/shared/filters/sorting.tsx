"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sorting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSorting, setSelectedSorting] = useState<string | undefined>(
    searchParams.get("sort") || ""
  );

  const handleValueChange = (value: string) => {
    if (value === "all") {
      setSelectedSorting("");
    } else {
      setSelectedSorting(value);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (selectedSorting) {
      searchParams.set("sort", selectedSorting);
    } else {
      searchParams.delete("sort");
    }

    if (searchParams.get("page")) searchParams.delete("page");

    router.replace(`?${searchParams.toString()}`);
  }, [selectedSorting, router]);

  return (
    <div className="flex flex-col gap-3">
      <h3>Řazení</h3>
      <Select value={selectedSorting} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Řadit podle" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="name">Název</SelectItem>
            <SelectItem value="price">Cena</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
