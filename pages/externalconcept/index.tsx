import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { ConceptPage } from "@/components/content/Entryscape/ConceptPage";

export default function Concept() {
  const { env } = useContext(SettingsContext);
  const { resource } = useRouter().query;

  if (!resource) return null;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={decodeURIComponent(resource as string)}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
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
