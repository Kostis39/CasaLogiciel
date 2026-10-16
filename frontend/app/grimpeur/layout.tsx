import { GrimpeurHeader } from "@/src/components/grimpeur_ui/grimpeurHeader";

export default function GrimpeurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_20fr] w-screen h-screen p-1 gap-1">
      <GrimpeurHeader />
      {children}
    </div>
  );
}