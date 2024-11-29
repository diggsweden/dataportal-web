import { Container } from "@/components/layout/container";
import { SettingsContext } from "@/providers/settings-provider";
import { usePathname } from "next/navigation";
import { FC, useContext, useEffect } from "react";
import { linkBase } from "@/utilities";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { useEntryScapeBlocks } from "@/hooks/use-entry-scape-blocks";

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
