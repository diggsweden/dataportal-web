"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Concept() {
  const router = useRouter();
  const params = useParams();
  const concept = params?.concept as string[] | undefined;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router as any,
        (params?.locale as string) || "sv",
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [concept]);

  return null;
}
