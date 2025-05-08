"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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
        <label htmlFor="search">Test: </label>
        <input
            className="border rounded-md "
            placeholder="Search"
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(e) => {
                handleSearch(e.target.value);
            }}
        />
    </div>
  );
}

export default SearchClient