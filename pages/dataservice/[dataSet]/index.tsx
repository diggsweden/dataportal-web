import { useRouter } from "next/router";
import { useContext } from "react";
import { EntrystoreProvider } from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { DataServicePage } from "@/components/content/Entryscape/DataServicePage";

export default function ExploreApiPage() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { dataSet, name } = query || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="dataservice"
    >
      <DataServicePage dataSet={dataSet} name={name} />
    </EntrystoreProvider>
  );
}
