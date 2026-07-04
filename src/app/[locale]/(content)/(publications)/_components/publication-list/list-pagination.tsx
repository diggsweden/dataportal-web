"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";

interface ListPaginationProps {
  totalResults: number;
  itemsPerPage: number;
  pageNumber: number;
}

/**
 * Client island that wires the (client) Pagination controls to the URL `page`
 * param, keeping the surrounding PublicationList a Server Component. A function prop
 * cannot cross the server/client boundary, so the router logic lives here.
 */
export function ListPagination({
  totalResults,
  itemsPerPage,
  pageNumber,
}: ListPaginationProps) {
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
    router.replace(qs ? `?${qs}` : (pathname ?? "/"));
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
