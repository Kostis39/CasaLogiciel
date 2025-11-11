import ClientPage from "@/src/components/client_ui/clientPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ClientPage />
    </Suspense>
  );
}
