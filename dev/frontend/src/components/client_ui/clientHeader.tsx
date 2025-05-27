import Link from "next/link";
import { buttonVariants } from "../ui/button";


export function ClientHeader(){
    return (
        <div className="flex gap-3 p-4">
            
            <Link 
            href="/" 
            className={`${buttonVariants({size: "lg", variant: "outline"})} flex-1`}
            >
                Menu
            </Link>

            <Link 
            href="client/inscription" 
            className={`${buttonVariants({size: "lg", variant: "outline"})} flex-2`}
            >
                Inscription
            </Link>

            <Link 
            href="/" 
            className={`${buttonVariants({size: "lg", variant: "outline"})} flex-2`}
            >
                Achat Annexe
            </Link>

            <Link 
            href="/" 
            className={`${buttonVariants({size: "lg", variant: "outline"})} flex-2`}
            >
                Club
            </Link>
        </div>

    );
}