"use client";
import SearchClient from "@/src/components/client_ui/clientSearch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SachaLayout({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
  const queryString = searchParams.toString();
    return (
    <div>
      <header className="p-4 bg-gray-100">Menu / Boutons ici</header>
      <div className="flex gap-4 p-4 bg-gray-100">
<PreserveQueryLink href="/dev/sacha/profil">Profil</PreserveQueryLink>      <Link href={`/dev/sacha/stats?${queryString}`}>Stats</Link>
      </div>
              <div>
          <SearchClient />
        </div>
      <main>{children}</main>
    </div>
  );
}
export function PreserveQueryLink({ href, children }: { href: string; children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const fullHref = `${href}?${searchParams.toString()}`;

  return <Link href={fullHref}>{children}</Link>;
}