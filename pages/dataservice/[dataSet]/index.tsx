import { useRouter } from "next/router";
import { useContext } from "react";

import { DataServicePage } from "@/features/entryscape/data-service-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

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
