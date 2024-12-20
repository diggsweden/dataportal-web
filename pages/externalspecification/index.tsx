import { useRouter } from "next/router";
import { useEffect } from "react";

import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Specification() {
  const router = useRouter();
  const { resource } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!resource) return;
      const isSandbox = window.location.host.includes("sandbox");

      await getEntryStoreProps({
        config: {
          pathPrefix: "/specifications",
          redirectPath: "/specifications",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
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
