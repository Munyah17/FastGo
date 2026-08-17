"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RideAutoComplete() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/ride/complete"), 20000);
    return () => clearTimeout(t);
  }, [router]);

  return null;
}
