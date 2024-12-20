import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Terminology() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const { term, param } = router.query || {};
  const [resourceUri, setResourceUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!term || !param) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await getEntryStoreProps({
        config: {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: term,
          secondParam: param as string,
        },
        locale: router.locale || "sv",
        isSandbox,
        router,
        includeBasePath: false,
      });

      if (data?.resourceUri) {
        setResourceUri(data.resourceUri);
      }
    };

    fetchEntryStoreProps();
  }, [term, param]);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="terminology"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}
