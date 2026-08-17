import { Suspense } from "react";
import DriveActiveContent from "./DriveActiveContent";

export default function DriveActivePage() {
  return (
    <Suspense fallback={null}>
      <DriveActiveContent />
    </Suspense>
  );
}
