"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const router = useRouter();
  const params = useParams();
  const terminology = params?.terminology as string[] | undefined;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router as any,
        (params?.locale as string) || "sv",
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [terminology]);

  return null;
}
