"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Pagination } from "@/components/pagination";

export function ListPagination({
  totalResults,
  itemsPerPage,
  pageNumber,
}: {
  totalResults: number;
  itemsPerPage: number;
  pageNumber: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (newPage !== 1) {
      params.set("page", String(newPage));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : (pathname ?? "/"));
  };

  return (
    <Pagination
      totalResults={totalResults}
      itemsPerPage={itemsPerPage}
      pageNumber={pageNumber}
      changePage={changePage}
    />
  );
}
