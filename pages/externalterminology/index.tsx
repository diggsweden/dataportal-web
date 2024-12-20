import { useRouter } from "next/router";
import { useEffect } from "react";

import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Terminology() {
  const router = useRouter();
  const { resource } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!resource) return;
      const isSandbox = window.location.host.includes("sandbox");

      await getEntryStoreProps({
        config: {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
        },
        locale: router.locale || "sv",
        isSandbox,
        router,
        resourceUri: resource as string,
        includeBasePath: false,
      });
    };

    fetchEntryStoreProps();
  }, [resource]);

  return null;
}
