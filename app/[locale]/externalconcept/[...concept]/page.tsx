"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function ExternalConceptCatchAll() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams<{ concept: string[] }>();
  const concept = params?.concept;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!concept) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: concept,
        },
        router,
        locale,
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [concept]);

  return null;
}
