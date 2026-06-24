"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function ExternalTerminologyCatchAll() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams<{ terminology: string[] }>();
  const terminology = params?.terminology;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!terminology) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: terminology,
        },
        router,
        locale,
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [terminology]);

  return null;
}
