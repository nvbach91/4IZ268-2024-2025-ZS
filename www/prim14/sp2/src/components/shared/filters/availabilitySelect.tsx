"use client";

import { useEffect, useState } from "react";
import ILookup from "@/models/ILookup";
import { getAvailabilityLookups } from "@/services/lookupService";
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

export default function AvailabilitySelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | undefined
  >(searchParams.get("availability") || "");
  const [availabilityLookups, setAvailabilityLookups] = useState<ILookup[]>();

  const fetchLookups = async () => {
    const resAvailability = await getAvailabilityLookups();
    if (resAvailability.success) {
      setAvailabilityLookups(resAvailability.data);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === "all") {
      setSelectedAvailability("");
    } else {
      setSelectedAvailability(value);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

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
      {availabilityLookups ? (
        <Select value={selectedAvailability} onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Dostupnost" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Vše</SelectItem>
              {availabilityLookups.map((lookup) => (
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
