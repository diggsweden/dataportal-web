import { useRouter } from "next/router";
import { useContext } from "react";

import { DatasetSeriesPage } from "@/features/entryscape/dataset-series-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function DataSeries() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { id } = query || {};
  const ids = (typeof id === "string" && id.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="dataset-series"
    >
      <DatasetSeriesPage />
    </EntrystoreProvider>
  );
}
