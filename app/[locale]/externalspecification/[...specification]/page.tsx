"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Specification() {
  const router = useRouter();
  const params = useParams();
  const specification = params?.specification as string[] | undefined;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router as any,
        (params?.locale as string) || "sv",
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [specification]);

  return null;
}
