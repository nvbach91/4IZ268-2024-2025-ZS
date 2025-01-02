"use client";

import { FaFilter } from "react-icons/fa";
import "./sidebar.css";
import AvailabilitySelect from "./filters/availabilitySelect";
import ConditionCheckboxes from "./filters/conditionCheckboxes";
import ILookup from "@/models/ILookup";

export default function Sidebar({
  conditions,
  availabilities,
}: {
  conditions?: Array<ILookup>;
  availabilities?: Array<ILookup>;
}) {
  return (
    <>
      <aside>
        <div className="flex gap-3 items-center">
          <FaFilter />
          <h2 className="text-xl font-semibold">Filtrování</h2>
        </div>
        <AvailabilitySelect availabilities={availabilities} />
        <ConditionCheckboxes conditions={conditions} />
      </aside>
    </>
  );
}
