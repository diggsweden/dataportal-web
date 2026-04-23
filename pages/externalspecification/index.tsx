import { useRouter } from "next/router";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Specification() {
  const router = useRouter();
  const locale = useLocale();
  const { resource } = router.query;

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
        resource as string,
      );
    };

    fetchEntryStoreProps();
  }, [resource]);

  return null;
}
