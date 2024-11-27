import { Container } from "@/components/layout/Container";
import { SettingsContext } from "@/providers/SettingsProvider";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect } from "react";
import { linkBase } from "@/utilities";
import { EntrystoreContext } from "@/providers/EntrystoreProvider";
import { useEntryScapeBlocks } from "@/hooks/useEntryScapeBlocks";

export const MQACategoryPage: FC = () => {
  const entry = useContext(EntrystoreContext);
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();

  useEntryScapeBlocks({
    entrystoreBase: entry.env.ENTRYSCAPE_MQA_PATH,
    env: entry.env,
    lang: "sv",
    pageType: "mqa",
    context: entry.context,
    esId: entry.esId,
  });

  useEffect(() => {
    setBreadcrumb &&
      setBreadcrumb({
        name: entry.title,
        crumbs: [
          { name: "start", link: { ...linkBase, link: "/" } },
          {
            name: "Metadatakvalitet per katalog",
            link: {
              ...linkBase,
              link: `/metadatakvalitet`,
            },
          },
        ],
      });
  }, [pathname, entry.title]);

  return (
    <Container>
      <div
        data-entryscape="config"
        data-entryscape-entrystore={`https://${entry.env.ENTRYSCAPE_MQA_PATH}/store`}
      />
      <div data-entryscape="catalogMQA" className="catalogMQA" />
    </Container>
  );
};
