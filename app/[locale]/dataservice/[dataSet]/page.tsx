"use client";

import { useParams } from "next/navigation";
import { useContext } from "react";

import { DataServicePage } from "@/features/entryscape/data-service-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function DataServiceDetail() {
  const { env } = useContext(SettingsContext);
  const params = useParams<{ dataSet: string }>();
  const dataSet = params?.dataSet;
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
      <DataServicePage dataSet={dataSet} name={undefined} />
    </EntrystoreProvider>
  );
}
