"use client";

import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const { env } = useContext(SettingsContext);
  const router = useRouter();
  const params = useParams();
  const term = params?.term as string | undefined;
  const param = params?.param as string | undefined;
  const [resourceUri, setResourceUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!term || !param) return;
      const isSandbox = window.location.host.includes("sandbox");

      const data = await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/terminology",
          entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
          param: term,
          secondParam: param as string,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router as any,
        (params?.locale as string) || "sv",
        isSandbox,
      );

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
