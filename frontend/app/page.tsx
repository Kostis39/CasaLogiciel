import { buttonVariants } from "@/src/components/ui/button"
import Link from "next/link";
import { toast } from "react-toastify";

const METABASE_URL: string = process.env.NEXT_PUBLIC_METABASE_URL || "";

export default function Home() {
  if (!METABASE_URL) {
    console.error("METABASE_URL is not defined in environment variables.");
  }
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
        <Link href={METABASE_URL} className={buttonVariants({size: "big", variant: "outline"})} target="_blank" >
          Statistiques
        </Link>
      </div>
    </div>
  );
}
