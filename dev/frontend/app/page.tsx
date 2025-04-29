import { Card } from "@/src/components/ui/card";
import { Button, buttonVariants } from "@/src/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
  
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
        Satistiques
        </Link>
        

        

      </div>
    </div>
  );
}
