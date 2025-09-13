"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

export function ClientCard(
  { prenom, nom, num }: { prenom: string , nom: string , num: number }
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedId = searchParams.get("id");
  const isSelected = selectedId === num.toString();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("id", num.toString());
    router.replace(`?${params.toString()}`);  // utilise push pour garder historique
  };

  return (
    <button
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl border py-3 px-3 shadow-sm",
        {
          "border-blue-600 border-2": isSelected,
          "hover:border-blue-300": !isSelected,
        }
      )}
      onClick={handleClick}
      aria-pressed={isSelected}
    >
      <div>
        <Image src="/avatar.png" alt="Avatar" width={70} height={70} />
      </div>
      <div>
        <p className="font-bold mb-2">{prenom} {nom}</p>
        <p className="text-sm">{num}</p>
      </div>
    </button>
  );
}
