import { useRouter } from "next/router";
import { useContext } from "react";
import { ApiIndexProvider } from "@/providers/ApiIndexContext";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { DataSetPage } from "@/components/content/Entryscape/DataSetPage";

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
        <DataSetPage />
      </EntrystoreProvider>
    </ApiIndexProvider>
  );
}
