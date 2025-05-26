"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function ClientCard(
  { prenom, nom, num }: { prenom: string , nom: string , num: number}
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("id", num.toString());
    replace(`${pathname}?${params.toString()}`);
};

    return (
      <button className="flex items-center gap-5 rounded-xl border py-5 px-5 shadow-sm"
      onClick={handleClick}
      >
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
      </button>
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