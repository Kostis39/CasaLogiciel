import { ClientHeader } from "@/src/components/client_ui/clientHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_20fr] w-screen h-screen p-1 gap-1 box-border overflow-hidden">
      <ClientHeader />
      {children}
    </div>

  );
}