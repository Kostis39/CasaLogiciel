import { GrimpeurInfiniteList } from "@/src/components/client_ui/clientListModif";
import SearchClient from "@/src/components/client_ui/clientSearch";


export default function GrimpeursPage() {
  return (
    <div className="flex flex-col overflow-auto">
      <div className="sticky top-0">
        <SearchClient />
      </div>
      <div className="">
        <GrimpeurInfiniteList />
      </div>
    </div>
  );
}