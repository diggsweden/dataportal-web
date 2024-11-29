import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SettingsContext } from "@/providers/settings-provider";
import EntrystoreProvider from "@/providers/entrystore-provider";
import { SpecificationPage } from "@/features/entryscape/specification-page";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { resource } = useRouter().query;

  if (!resource) return null;

  return (
    <EntrystoreProvider
      env={env}
      entryUri={decodeURIComponent(resource as string)}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="specification"
    >
      <SpecificationPage uri={resource as string} />
    </EntrystoreProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { resource },
}) => ({
  notFound: !resource,
  props: {},
});
