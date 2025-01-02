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
import { Skeleton } from "../../ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import ILookup from "@/models/ILookup";

export default function AvailabilitySelect({
  availabilities,
}: {
  availabilities?: Array<ILookup>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | undefined
  >(searchParams.get("availability") || "");

  const handleValueChange = (value: string) => {
    if (value === "all") {
      setSelectedAvailability("");
    } else {
      setSelectedAvailability(value);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (selectedAvailability) {
      searchParams.set("availability", selectedAvailability);
    } else {
      searchParams.delete("availability");
    }

    router.replace(`?${searchParams.toString()}`);
  }, [selectedAvailability, router]);

  return (
    <>
      {availabilities ? (
        <Select value={selectedAvailability} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Dostupnost" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Vše</SelectItem>
              {availabilities.map((lookup) => (
                <SelectItem key={lookup._id} value={lookup._id}>
                  {lookup.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Skeleton className="h-10 w-full rounded-md" />
      )}
    </>
  );
}
