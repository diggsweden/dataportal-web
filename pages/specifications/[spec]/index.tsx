import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { SpecificationPage } from "@/features/entryscape/specification-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const { spec } = router.query || {};
  const [resourceUri, setResourceUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!spec) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await handleEntryStoreRedirect(
        {
          pathPrefix: "/specifications",
          redirectPath: "/specifications",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
          param: spec,
        },
        router,
        router.locale || "sv",
        isSandbox,
      );

      if (data?.resourceUri) {
        setResourceUri(data.resourceUri);
      }
      setIsLoading(false);
    };

    fetchEntryStoreProps();
  }, [spec]);

  if (isLoading) {
    return null;
  }

  if (resourceUri) {
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

  const ids = (typeof spec === "string" && spec.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  if (eid && cid) {
    return (
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
        pageType="specification"
      >
        <SpecificationPage />
      </EntrystoreProvider>
    );
  }
}
