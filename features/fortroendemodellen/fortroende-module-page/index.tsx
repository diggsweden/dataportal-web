import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState } from "react";

import { BlockList } from "@/components/blocks/block-list";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { highlightCode } from "@/features/pages/container-page";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const FortroendeModulePage: FC<ModuleDataFragment> = ({ blocks }) => {
  const [heading, setHeading] = useState<string | null>(null);
  const { setBreadcrumb } = useContext(SettingsContext);
  const { t } = useTranslation();
  const pathname = usePathname();

  const getHeading = () => {
    if (blocks[0]?.__typename === "dataportal_Digg_Text") {
      const str = blocks[0].heading;
      blocks[0].heading = null;
      return str;
    } else {
      return null;
    }
  };

  useEffect(() => {
    //Highlight code blocks using prismjs
    highlightCode(t);
    setHeading(getHeading());
  }, []);

  useEffect(() => {
    setBreadcrumb?.({
      name: heading!,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: "Förtroendemodellen",
          link: {
            ...linkBase,
            link: "/fortroendemodellen",
          },
        },
      ],
    });
  }, [pathname, heading]);

  return (
    <Container>
      {heading && (
        <Heading level={1} size={"lg"} className="mb-xl">
          {heading}
        </Heading>
      )}

      {blocks && <BlockList blocks={blocks} />}
    </Container>
  );
};
