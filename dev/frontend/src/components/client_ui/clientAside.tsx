import { fetchGrimpeurById } from "@/src/services/api";
import Image from "next/image";

export async function ClientCard(
  { prenom, nom, num }: { prenom: string , nom: string , num: number}
) {
    return (
      <div className="flex items-center gap-5 rounded-xl border py-5 px-5 shadow-sm">
        <div className="">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={70}
            height={70}
          />
        </div>
        <div className="">
          <p className="font-bold mb-2">{prenom} {nom}</p>
          <p className="text-sm">{num}</p>
        </div>
      </div>
    );
}

export function ClientAside(){
  return (
    <>
      <input
        type="text"
        placeholder="Rechercher un grimpeur..."
        className="w-full border border-gray-300 mb-4"
      />
      <ClientCard prenom="Test" nom="Main" num={100} />
      
    </>
  );
}