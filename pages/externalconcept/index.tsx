import { useRouter } from "next/router";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Concept() {
  const router = useRouter();
  const { resource } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!resource) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
        },
        router,
        router.locale || "sv",
        isSandbox,
        resource as string,
      );
    };

    fetchEntryStoreProps();
  }, [resource]);

  return null;
}
