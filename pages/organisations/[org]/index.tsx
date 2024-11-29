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
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="organisation"
    >
      <OrganisationPage />
    </EntrystoreProvider>
  );
}
