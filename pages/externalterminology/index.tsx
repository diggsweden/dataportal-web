import { useRouter } from "next/router";
import { useContext } from "react";
import { SettingsContext } from "@/providers/settings-provider";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { ConceptPage } from "@/features/entryscape/concept-page";
import { GetServerSideProps } from "next";

export default function Terminology() {
  const { env } = useContext(SettingsContext);
  const { resource } = useRouter().query;

  if (!resource) return null;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={decodeURIComponent(resource as string)}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="terminology"
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
