import { useRouter } from "next/router";
import { useContext } from "react";
import { ApiIndexProvider } from "@/providers/ApiIndexContext";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { DataSetPage } from "@/components/content/Entryscape/DataSetPage";
import { useScript } from "@/hooks/useScript";

export default function DataSet() {
  const { env } = useContext(SettingsContext);

  const { query } = useRouter() || {};
  const { dataSet } = query || {};
  const ids = (typeof dataSet === "string" && dataSet.split("_")) || [];
  const cid = ids[0];
  const eid = ids[1];
  const postscribeStatus = useScript(
    "/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous",
  );
  return postscribeStatus === "ready" ? (
    <ApiIndexProvider apiIndexFileUrl={env.API_DETECTION_PATH}>
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
        fetchMore={false}
      >
        <DataSetPage />
      </EntrystoreProvider>
    </ApiIndexProvider>
  ) : (
    <></>
  );
}
