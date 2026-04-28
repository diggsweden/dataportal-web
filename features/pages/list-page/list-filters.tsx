"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/button";

interface Keyword {
  value: string;
  id: string;
}

export function ListFilters({
  keywords,
  activeFilterId,
}: {
  keywords: Keyword[];
  activeFilterId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = (keyword: Keyword) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (keyword.id === "0") {
      params.delete("filter");
    } else {
      params.set("filter", keyword.id);
    }
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : (pathname ?? "/"));
  };

  return (
    <div data-test-id="list-filters" className="mt-xl flex flex-wrap gap-md">
      {keywords.map((keyword, idx) => (
        <Button
          variant="plain"
          key={idx}
          onClick={() => setFilter(keyword)}
          label={keyword.value}
          className={`${
            keyword.id === activeFilterId &&
            "hover-none bg-pink-200 font-strong text-blackOpaque3 hover:bg-pink-200"
          }`}
        />
      ))}
    </div>
  );
}
