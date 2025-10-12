import { GrimpeurInfiniteList } from "@/src/components/client_ui/clientListModif";
import SearchClient from "@/src/components/client_ui/clientSearch";


export default function GrimpeursPage() {
  return (
    <div className="grid overflow-auto" style={{gridTemplateColumns: "1fr 1fr"}}>
      <div className="overflow-auto">
          <GrimpeurInfiniteList />
      </div>

      <div className="overflow-auto">
        <div className="sticky top-0">
          <SearchClient />
        </div>
      </div>
    </div>
  );
}