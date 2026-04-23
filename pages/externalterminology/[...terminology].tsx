import { useRouter } from "next/router";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const router = useRouter();
  const locale = useLocale();
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
        locale,
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [terminology]);

  return null;
}
