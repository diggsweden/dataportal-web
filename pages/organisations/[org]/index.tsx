import { useRouter } from "next/router";
import { useContext } from "react";
import { EntrystoreProvider } from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { OrganisationPage } from "@/components/content/Entryscape/OrganisationPage";

export default function ExploreApiPage() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { org } = query || {};
  const ids = (typeof org === "string" && org.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      // entryUri={`https://${env.ENTRYSCAPE_DATASETS_PATH}/store/${ids}`}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="organisation"
    >
      <OrganisationPage />
    </EntrystoreProvider>
  );
}
