"use client";
import { Search, Sidebar } from "lucide-react"
import { Label } from "@/src/components/ui/label";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "../ui/sidebar";

const SearchClient = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("query", searchTerm);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);
  return (
    <div>
        <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
        <Label htmlFor="search" className="sr-only"></Label>
        <SidebarInput
            className="pl-8"
            placeholder="Num, nom, prenom"
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(e) => {
                handleSearch(e.target.value);
            }}
        />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
        </SidebarGroup>

    </div>
  );
}

export default SearchClient