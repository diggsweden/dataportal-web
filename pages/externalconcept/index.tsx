import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useContext } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

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
