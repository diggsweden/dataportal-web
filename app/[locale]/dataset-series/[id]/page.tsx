"use client";

import { useParams } from "next/navigation";
import { useContext } from "react";

import { DatasetSeriesPage } from "@/features/entryscape/dataset-series-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function DataSeries() {
  const { env } = useContext(SettingsContext);
  const params = useParams<{ id: string }>();
  const id = params?.id;
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
