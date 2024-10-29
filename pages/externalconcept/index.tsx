import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { ConceptPage } from "@/components/content/Entryscape/ConceptPage";
import { useScript } from "@/hooks/useScript";

export default function Concept() {
  const { env } = useContext(SettingsContext);
  const { resource } = useRouter().query;

  const postscribeStatus = useScript(
    "/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous",
  );

  if (postscribeStatus !== "ready" || !resource) return null;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={decodeURIComponent(resource as string)}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      fetchMore={false}
      isConcept={true}
    >
      <ConceptPage uri={resource as string} />
    </EntrystoreProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { resource },
}) => ({
  notFound: !resource,
  props: {},
});
