import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Concept() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const { concept } = router.query || {};
  const [resourceUri, setResourceUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!concept) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: concept,
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
  }, [concept]);

  if (isLoading) {
    return null;
  }

  if (resourceUri) {
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

  const ids = (typeof concept === "string" && concept.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}
