import { useRouter } from "next/router";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Concept() {
  const router = useRouter();
  const locale = useLocale();
  const { concept } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!concept) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: concept,
        },
        router,
        locale,
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [concept]);

  return null;
}
