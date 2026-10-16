import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";


export function GrimpeurHeader(){
    return (
        <div className="flex flex-col">
            <LinkGrimpeur src="/ordinateur.svg" alt="Ordinateur" href="/grimpeur" name="Saisies"/>
            <LinkGrimpeur src="/inscription.svg" alt="Inscription" href="/grimpeur/inscription" name="Inscription"/>
            <LinkGrimpeur src="/history.svg" alt="Historique" href="/grimpeur/history" name="Historique"/>
            <LinkGrimpeur src="/menu.svg" alt="Menu" href="/" name="Menu"/>
        </div>

    );
}

function LinkGrimpeur( {src, alt, href, name} : {src: string, alt: string, href: string, name:string} ){
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