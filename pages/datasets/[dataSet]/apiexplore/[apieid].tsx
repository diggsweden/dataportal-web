import { DataSetExploreApiPage } from "@/components/content/Entryscape/DatasetExploreApiPage";
// export default DataSetExploreApiPage;
import { useRouter } from "next/router";
import { useContext } from "react";
import { ApiIndexProvider } from "@/providers/ApiIndexContext";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";

export default function ExploreApiPage() {
  const { env } = useContext(SettingsContext);

  const { query } = useRouter() || {};
  const { dataSet, apieid } = query || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];

  return (
    <ApiIndexProvider apiIndexFileUrl={env.API_DETECTION_PATH}>
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
        pageType="apiexplore"
      >
        <DataSetExploreApiPage dataSet={dataSet} apieid={apieid} />
      </EntrystoreProvider>
    </ApiIndexProvider>
  );
}
