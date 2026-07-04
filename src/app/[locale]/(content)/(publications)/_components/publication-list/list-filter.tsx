"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/button";

interface Keyword {
  value: string;
  id: string;
}

interface ListFilterProps {
  keywords: Keyword[];
  activeId: string;
}

/**
 * Client island for the keyword filter. Selecting a keyword writes it to the
 * URL (`filter` param) so the server can render the filtered list; the grid
 * itself stays a Server Component.
 */
export function ListFilter({ keywords, activeId }: ListFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectFilter = (id: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (id === "0") {
      params.delete("filter");
    } else {
      params.set("filter", id);
    }
    // Reset to the first page whenever the filter changes.
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : (pathname ?? "/"));
  };

  return (
    <div data-test-id="list-filters" className="mt-xl flex flex-wrap gap-md">
      {keywords.map((keyword) => (
        <Button
          variant="plain"
          key={keyword.id}
          onClick={() => selectFilter(keyword.id)}
          label={keyword.value}
          className={`${
            keyword.id === activeId &&
            "hover-none bg-pink-200 font-strong text-blackOpaque3 hover:bg-pink-200"
          }`}
        />
      ))}
    </div>
  );
}
