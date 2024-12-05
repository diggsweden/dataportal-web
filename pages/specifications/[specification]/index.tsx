import { useRouter } from "next/router";
import { useContext } from "react";

import { SpecificationPage } from "@/features/entryscape/specification-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { specification } = query || {};
  const curi = specification;
  let entryUri = "";

  if (env.ENTRYSCAPE_SPECS_PATH.includes("sandbox"))
    entryUri = `https://www-sandbox.dataportal.se/specifications/${curi}`;
  else entryUri = `https://dataportal.se/specifications/${curi}`;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="specification"
    >
      <SpecificationPage {...(typeof curi === "string" ? { curi } : {})} />
    </EntrystoreProvider>
  );
}
