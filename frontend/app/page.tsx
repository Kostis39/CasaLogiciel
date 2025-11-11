import { buttonVariants } from "@/src/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-6xl font-extrabold tracking-tight text-primary mb-10">Casamur</h1>
      <div className="grid grid-cols-2 grid-rows-2 gap-5">
        <Link href="/client" className={buttonVariants({size: "big", variant: "outline"})}>
          Client
        </Link>
        <Link href="/admin" className={buttonVariants({size: "big", variant: "outline"})}>
          Administrateur
        </Link>
        <Link href="/recap" className={buttonVariants({size: "big", variant: "outline"})}>
          Récapitulatif
        </Link>
        <Link href="/stats" className={buttonVariants({size: "big", variant: "outline"})}>
          Statistiques
        </Link>
      </div>
    </div>
  );
}
