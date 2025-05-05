import "./client.css";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";
import { ClientAside } from "@/src/components/client_ui/clientAside";
import { Content } from "@/src/components/client_ui/clientContent";


export default function ClientHome() {
  return (
    <div className="mainClientContainer w-full h-screen">

      {/* Header */}
      <div className="headerClient bg-blue-50 ">
        <ClientHeader />
      </div>

      {/* Aside: Search bar + liste client */}
      <div className="bg-amber-400">
        <ClientAside />
      </div>

      {/* Content: Grimpeur infos + market */}
      <div className="bg-red-400">
        <Content/>
      </div>

    </div>
  );
}
