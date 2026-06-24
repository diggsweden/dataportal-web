"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";

import { MQACategoryPage } from "@/features/entryscape/mqa-category-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function MqaCategoryPage() {
  const { env } = useContext(SettingsContext);
  const pathname = usePathname() ?? "";
  const ids = pathname.split("/");
  const mqaIndex = ids.indexOf("metadatakvalitet");
  const eid = ids[mqaIndex + 1];
  const cid = ids[mqaIndex + 2];

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
