import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const MQAPage: FC = () => {
  const { env, setBreadcrumb } = useContext(SettingsContext);
  const { lang } = useTranslation();
  const pathname = usePathname();
  const pageTitle = "Metadatakvalitet per katalog";

  useEntryScapeBlocks({
    entrystoreBase: `https://${env.ENTRYSCAPE_MQA_PATH}/store`,
    env: env,
    lang: lang,
    pageType: "mqa",
    context: "",
    esId: "",
  });
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
      />

      <div data-entryscape="totMQA" className="totMQA" />
    </Container>
  );
};
