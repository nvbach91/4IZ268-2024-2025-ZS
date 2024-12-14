"use client";

import { FaFilter } from "react-icons/fa";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside>
      <div className="flex gap-3 items-center">
        <FaFilter />
        <h2 className="text-xl font-semibold">Filtrování</h2>
      </div>
    </aside>
  );
}
