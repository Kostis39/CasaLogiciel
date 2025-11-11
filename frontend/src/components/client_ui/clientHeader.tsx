import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";


export function ClientHeader(){
    return (
        <div className="flex flex-col">

            <LinkClient src="/menu.svg" alt="Menu" href="/" name="Menu"/>
            <LinkClient src="/ordinateur.svg" alt="Ordinateur" href="/client" name="Saisies"/>
            <LinkClient src="/inscription.svg" alt="Inscription" href="/client/inscription" name="Inscription"/>
            <LinkClient src="/history.svg" alt="Historique" href="/client/history" name="Historique"/>
        </div>

    );
}

function LinkClient( {src, alt, href, name} : {src: string, alt: string, href: string, name:string} ){
    return (
        <Link 
        href= {href}
        className={`${buttonVariants({size: "sm", variant: "outline"})} flex-1 flex flex-col`}
        >
            <Image src={src} alt={alt} width={40} height={40} />
            {name}
        </Link>
    );
}