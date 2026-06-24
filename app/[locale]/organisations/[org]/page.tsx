"use client";

import { useParams } from "next/navigation";
import { useContext } from "react";

import { OrganisationPage } from "@/features/entryscape/organisation-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function Organisation() {
  const { env } = useContext(SettingsContext);
  const params = useParams<{ org: string }>();
  const org = params?.org;
  const ids = (typeof org === "string" && org.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_DATASETS_PATH}
      pageType="organisation"
    >
      <OrganisationPage />
    </EntrystoreProvider>
  );
}
