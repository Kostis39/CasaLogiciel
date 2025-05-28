import { Button, buttonVariants } from "@/src/components/ui/button";
import Link from "next/link";

const EntrancePage = async ({
  searchParams,
}: {
    searchParams?: {
    id?: string;
    query?: string;
  };
}) => {
  const query = (await searchParams)?.query || "";
  const id = (await searchParams)?.id;

  return (
    <div>
        <Link 
        href={`/client?query=${query}&id=${id}`}
        className={`${buttonVariants({size: "lg", variant: "outline"})}`}>
            Retour
        </Link>
        <Link href={`/client/market/abo?query=${query}&id=${id}`}>
            <Button variant="outline">Achat Abonnement</Button>
        </Link>
        <Link href={`/client/market/annexe?query=${query}&id=${id}`}>
            <Button variant="outline">Achat Annexe</Button>
        </Link>
        EntrancePage
    </div>
  );
}

export default EntrancePage;