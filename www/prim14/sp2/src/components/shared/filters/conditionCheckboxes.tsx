"use client";

import { useEffect, useState } from "react";
import ILookup, { ICheckableLookup } from "@/models/ILookup";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConditionCheckboxes({
  conditions,
}: {
  conditions?: Array<ILookup>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conditionLookups, setConditionLookups] =
    useState<ICheckableLookup[]>();

  useEffect(() => {
    if (conditions) {
      setConditionLookups(
        conditions.map((lookup) => ({
          ...lookup,
          checked: searchParams.getAll("condition").includes(lookup._id),
        }))
      );
    }
  }, [conditions, searchParams]);

  /**
   * Handles adding or removing a condition from the URL query
   * If condition is checked, it will be added to the query
   * @param conditionId id of the condition
   * @param value whether the condition is checked
   */
  const handleChangeConditions = (conditionId: string, value: boolean) => {
    const searchParams = new URLSearchParams(window.location.search);
    const existingConditions = searchParams.getAll("condition");

    if (value) {
      if (!existingConditions.includes(conditionId)) {
        searchParams.append("condition", conditionId);
      }
    } else {
      const updatedConditions = existingConditions.filter(
        (id) => id !== conditionId
      );
      searchParams.delete("condition");
      updatedConditions.forEach((id) => searchParams.append("condition", id));
    }

    setConditionLookups(
      conditionLookups?.map((lookup) => ({
        ...lookup,
        checked: lookup._id === conditionId ? value : lookup.checked,
      }))
    );

    router.replace(`?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3">
      {conditionLookups ? (
        <>
          <h3>Stav zboží</h3>
          <div className="flex flex-col gap-2">
            {conditionLookups.map((lookup) => (
              <div className="flex items-center space-x-2" key={lookup._id}>
                <Checkbox
                  id={lookup._id}
                  onCheckedChange={(checked) => {
                    handleChangeConditions(lookup._id, !!checked);
                  }}
                  checked={lookup.checked}
                />
                <label
                  htmlFor={lookup._id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {lookup.label}
                </label>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </>
      )}
    </div>
  );
}
