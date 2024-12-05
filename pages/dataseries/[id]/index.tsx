import { useRouter } from "next/router";
import { useContext } from "react";

import { DatasetPage } from "@/features/entryscape/dataset-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function DataSeries() {
  const { env } = useContext(SettingsContext);

  const { query } = useRouter() || {};
  const { dataSeries } = query || {};
  const curi = dataSeries;
  let entryUri = "";

  if (env.ENTRYSCAPE_SPECS_PATH.includes("sandbox"))
    entryUri = `https://www-sandbox.dataportal.se/dataseries/${curi}`;
  else entryUri = `https://dataportal.se/dataseries/${curi}`;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="dataseries"
    >
      <DatasetPage />
    </EntrystoreProvider>
  );
}
