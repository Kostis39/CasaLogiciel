import "./client.css";
import ClientContent from "@/src/components/client_ui/clientContent";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";
export  default function ClientHome() {

  return (
    <div className="mainClientContainer w-full h-screen">
      
      <div className=" bg-blue-50 ">
        <ClientHeader />
      </div>

      <ClientContent />

    </div>
  );
}