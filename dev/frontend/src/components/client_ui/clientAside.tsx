import Image from "next/image";

export function ClientCard() {
  return (
    <div className="flex items-center gap-5 rounded-xl border py-5 px-5 shadow-sm ">
        <div className="">
            <Image
            src="/avatar.png"
            alt="Avatar"
            width={70}
            height={70}
            />
        </div>
        <div className="">
            <p className="text-xl font-bold mb-2">Numéro</p>
            <p className="text-sm text-muted-foreground">Prénom</p>
            <p className="text-sm text-muted-foreground">Nom</p>
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

      <ClientCard/>
    </>
  );
}