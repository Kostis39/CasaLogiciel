import { buttonVariants } from "@/src/components/ui/button";
import Link from "next/link";

const AboPage = async ({
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
        AboPage
    </div>
  );
}

export default AboPage;