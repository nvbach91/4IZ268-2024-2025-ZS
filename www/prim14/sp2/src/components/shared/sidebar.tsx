"use client";

import { FaFilter } from "react-icons/fa";
import "./sidebar.css";
import { useEffect } from "react";
import AvailabilitySelect from "./filters/availabilitySelect";
import ConditionCheckboxes from "./filters/conditionCheckboxes";

export default function Sidebar() {
  const fetchLookups = async () => {};

  useEffect(() => {
    fetchLookups();
  }, []);

  return (
    <>
      <aside>
        <div className="flex gap-3 items-center">
          <FaFilter />
          <h2 className="text-xl font-semibold">Filtrování</h2>
        </div>
        <AvailabilitySelect />
        <ConditionCheckboxes />
      </aside>
    </>
  );
}
