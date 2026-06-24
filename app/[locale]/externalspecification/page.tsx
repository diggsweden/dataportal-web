"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function ExternalSpecification() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const resource = searchParams?.get("resource");

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!resource) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/specifications",
          redirectPath: "/specifications",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
        },
        router,
        locale,
        isSandbox,
        resource,
      );
    };

    fetchEntryStoreProps();
  }, [resource]);

  return null;
}
