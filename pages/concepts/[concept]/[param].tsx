import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Concept() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const { concept, param } = router.query || {};
  const [resourceUri, setResourceUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!concept || !param) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await getEntryStoreProps({
        config: {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: concept,
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
  }, [concept, param]);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}
