"use client";

import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function ExternalSpecificationCatchAll() {
  const router = useRouter();
  const locale = useLocale();
  const params = useParams<{ specification: string[] }>();
  const specification = params?.specification;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!specification) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
          param: specification,
        },
        router,
        locale,
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [specification]);

  return null;
}
