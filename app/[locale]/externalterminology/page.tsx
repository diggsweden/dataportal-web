"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const resource = searchParams?.get("resource");

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!resource) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router as any,
        (params?.locale as string) || "sv",
        isSandbox,
        resource as string,
      );
    };

    fetchEntryStoreProps();
  }, [resource]);

  return null;
}
