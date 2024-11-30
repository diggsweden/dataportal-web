import { useRouter } from "next/router";
import { useContext } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function Concept() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { concept } = query || {};
  const curi = concept;
  let entryUri = "";

  if (env.ENTRYSCAPE_TERMS_PATH.includes("sandbox"))
    entryUri = `https://www-sandbox.dataportal.se/concepts/${curi}`;
  else entryUri = `https://dataportal.se/concepts/${curi}`;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
    >
      <ConceptPage {...(typeof curi === "string" ? { curi } : {})} />
    </EntrystoreProvider>
  );
}
