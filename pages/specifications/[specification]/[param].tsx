import { useRouter } from "next/router";
import { useContext } from "react";
import { SpecificationPage } from "@/components/content/Entryscape/SpecificationPage";
import { SettingsContext } from "@/providers/SettingsProvider";
import EntrystoreProvider from "@/providers/EntrystoreProvider";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { specification, param } = query || {};
  const curi = `${specification}/${param}`;
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
      <SpecificationPage curi={curi} />
    </EntrystoreProvider>
  );
}
