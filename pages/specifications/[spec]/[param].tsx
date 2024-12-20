import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { SpecificationPage } from "@/features/entryscape/specification-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { getEntryStoreProps } from "@/utilities/entrystore/get-entrystore-props";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const { spec, param } = router.query || {};
  const [resourceUri, setResourceUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!spec || !param) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await getEntryStoreProps({
        config: {
          pathPrefix: "/specifications",
          redirectPath: "/specifications",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
          param: spec,
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
  }, [spec, param]);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="specification"
    >
      <SpecificationPage />
    </EntrystoreProvider>
  );
}
