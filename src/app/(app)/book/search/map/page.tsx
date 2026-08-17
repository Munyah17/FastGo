import { Suspense } from "react";
import ChooseOnMapContent from "./ChooseOnMapContent";

export default function ChooseOnMapPage() {
  return (
    <Suspense fallback={null}>
      <ChooseOnMapContent />
    </Suspense>
  );
}
