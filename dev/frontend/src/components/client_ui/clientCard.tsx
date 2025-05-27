"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function ClientCard(
  { prenom, nom, num }: { prenom: string , nom: string , num: number}
) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("id", num.toString());
    replace(`?${params.toString()}`);};

    return (
      <button className="flex w-full items-center gap-3 rounded-xl border py-3 px-3 shadow-sm"
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
