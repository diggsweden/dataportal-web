import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect, useState } from "react";

import fortroendemodellImage from "@/assets/logos/fortroendemodellen.png";
import { BlockList } from "@/components/blocks/block-list";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { highlightCode } from "@/features/pages/container-page";
import { ModuleDataFragment } from "@/graphql/__generated__/operations";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const FortroendeEndPage: FC<ModuleDataFragment> = ({ blocks }) => {
  const [heading, setHeading] = useState<string | null>(null);
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const { t } = useTranslation();

  const getHeading = () => {
    if (blocks[0].__typename === "dataportal_Digg_Text") {
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

  // Temporary breadcrumbs for förtroendemodellen
  useEffect(() => {
    setBreadcrumb?.({
      name: "Förtroendemärkning",
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
  }, [pathname]);

  return (
    <Container className="space-y-xl">
      {heading && (
        <Heading level={1} size={"lg"}>
          {heading}
        </Heading>
      )}

      {blocks && <BlockList blocks={blocks} />}
      <div className="flex max-w-md justify-center">
        <Link
          href="https://dataportal.se"
          rel="external noopener noreferrer"
          title="Fortroendemodellen logo badge"
          className="inline-block"
        >
          <Image
            src={fortroendemodellImage.src}
            width={200}
            height={200}
            alt="Förtroendemodellen logo badge"
          />
        </Link>
      </div>
    </Container>
  );
};
