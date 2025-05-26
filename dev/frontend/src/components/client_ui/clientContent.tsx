import { ClientAside } from "./clientAside";
import { ClientInfo } from "./clientMenu";

const ClientContent = () => {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 5fr" }}>

    <div className="bg-red-500">
      <ClientAside />
    </div>
    
    <div className="bg-yellow-400">
      <ClientInfo />
    </div>

  </div>
  );
}

export default ClientContent