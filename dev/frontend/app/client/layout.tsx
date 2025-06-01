import "./client.css";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";

export default function ClientLayout({
  aside,
  main,
}: {
  aside: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
      <div className="mainClientContainer w-full h-screen">
        <div className=" bg-blue-50 ">
          <ClientHeader />
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 5fr" }}>
          <div>
            {aside}
          </div>
          <div>
            {main}          
          </div>
        </div>
      </div>

  );
}
