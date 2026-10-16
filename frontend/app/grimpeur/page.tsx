import GrimpeurPage from "@/src/components/grimpeur_ui/grimpeurPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <GrimpeurPage />
    </Suspense>
  );
}
