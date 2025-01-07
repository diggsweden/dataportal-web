import { useRouter } from "next/router";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const router = useRouter();
  const { terminology } = router.query;

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
        router.locale || "sv",
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [terminology]);

  return null;
}
