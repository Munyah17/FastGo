"use client";

import { useMode } from "@/lib/ModeContext";
import PassengerHome from "./PassengerHome";
import DriverHome from "./DriverHome";

export default function HomePage() {
  const { mode } = useMode();

  return (
    <div className="relative h-full min-h-[600px] overflow-hidden">
      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          mode === "passenger" ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <PassengerHome />
      </div>
      <div
        className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
          mode === "driver" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <DriverHome />
      </div>
    </div>
  );
}
