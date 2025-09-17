import "./client.css";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mainClientContainer">
      <ClientHeader />
      {children}
    </div>

  );
}
