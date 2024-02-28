import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SettingsContext } from "@/providers/SettingsProvider";
import EntrystoreProvider from "@/providers/EntrystoreProvider";
import { useScript } from "@/hooks/useScript";
import { SpecificationPage } from "@/components/content/Entryscape/SpecificationPage";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { specification } = query || {};
  const paths = [...(specification ? (specification as string[]) : [])];
  const scheme = paths.shift();
  const curi = paths.join("/");
  const entryUri = `${scheme}://${curi}`;
  const postscribeStatus = useScript(
    "/postscribe.min.js",
    "sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM",
    "anonymous",
  );
  return postscribeStatus === "ready" && paths.length > 0 ? (
    <EntrystoreProvider
      env={env}
      entryUri={entryUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      fetchMore={false}
    >
      <SpecificationPage scheme={scheme} curi={curi} />
    </EntrystoreProvider>
  ) : (
    <></>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const specification = (params?.specification as string[]) || [];
  const scheme = specification[0];

  if (scheme != "http" && scheme != "https") {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
