"use client";

import { useMode } from "@/lib/ModeContext";
import PassengerHome from "./PassengerHome";
import DriverHome from "./DriverHome";

export default function HomePage() {
  const { mode } = useMode();
  return mode === "passenger" ? <PassengerHome /> : <DriverHome />;
}
