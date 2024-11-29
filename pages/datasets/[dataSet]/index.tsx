import { useRouter } from "next/router";
import { useContext } from "react";
import { ApiIndexProvider } from "@/providers/api-index-context";
import EntrystoreProvider from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { DatasetPage } from "@/features/entryscape/dataset-page";

export default function DataSet() {
  const { env } = useContext(SettingsContext);

  const { query } = useRouter() || {};
  const { dataSet } = query || {};
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
        pageType="dataset"
      >
        <DatasetPage />
      </EntrystoreProvider>
    </ApiIndexProvider>
  );
}
