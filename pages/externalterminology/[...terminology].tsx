import { useRouter } from "next/router";
import { useEffect } from "react";

import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Terminology() {
  const router = useRouter();
  const { terminology } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!terminology) return;
      const isSandbox = window.location.host.includes("sandbox");

      await getEntryStoreProps({
        config: {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: terminology,
        },
        locale: router.locale || "sv",
        isSandbox,
        router,
        includeBasePath: false,
      });
    };

    fetchEntryStoreProps();
  }, [terminology]);

  return null;
}
