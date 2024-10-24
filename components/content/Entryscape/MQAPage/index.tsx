import { FC, useContext, useEffect } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import { linkBase } from "@/utilities";
import { usePathname } from "next/navigation";

export const MQAPage: FC = () => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const pageTitle = "Metadatakvalitet per katalog";

  /**
   * Async load scripts requiered for EntryScape blocks,
   * or else blocks wont have access to DOM
   */
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = env.ENTRYSCAPE_MQA_URL;

    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = env.ENTRYSCAPE_BLOCKS_URL;
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: pageTitle,
        crumbs: [{ name: "start", link: { ...linkBase, link: "/" } }],
      });
  }, [pathname]);

  return (
    <Container>
      <Heading level={1} size={"lg"} className="mb-lg md:mb-xl">
        {pageTitle}
      </Heading>

      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${env.ENTRYSCAPE_MQA_PATH}/store`}
        data-entryscape-clicks='{"katalog": "/metadatakvalitet/katalog/${entry}/${context}"}'
      ></div>

      <div data-entryscape="totMQA" className="totMQA"></div>
    </Container>
  );
};
