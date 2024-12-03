import { MQACategoryPage } from "@/components/content/Entryscape/MQACategoryPage";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function MqaCategoryPage() {
  const { env } = useContext(SettingsContext);
  const { asPath } = useRouter() || {};
  const ids = asPath.split("/");
  const eid = ids[3];
  const cid = ids[4];

  if (!cid || !eid) return null;

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_MQA_PATH}
      pageType="mqa"
    >
      <MQACategoryPage />
    </EntrystoreProvider>
  );
}
