import { useRouter } from "next/router";
import { useEffect } from "react";

import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Specification() {
  const router = useRouter();
  const { specification } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!specification) return;
      const isSandbox = window.location.host.includes("sandbox");

      await getEntryStoreProps({
        config: {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
          param: specification,
        },
        locale: router.locale || "sv",
        isSandbox,
        router,
        includeBasePath: false,
      });
    };

    fetchEntryStoreProps();
  }, [specification]);
  return null;
}
