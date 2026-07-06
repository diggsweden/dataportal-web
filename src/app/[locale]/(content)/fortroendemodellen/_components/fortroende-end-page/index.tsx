"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import fortroendemodellImage from "@/assets/logos/fortroendemodellen.png";
import { BlockList } from "@/components/blocks/block-list";
import { TextFragment } from "@/components/blocks/text-block";
import { Container } from "@/components/layout/container";
import { AppLink } from "@/components/link";
import { Heading } from "@/components/typography/heading";
import { BlockDataFragment } from "@/graphql/fragments";
import { type FragmentType, getFragmentData } from "@/graphql/gql";
import type { ModuleDataFragment } from "@/graphql/gql/graphql";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";
import { highlightCode } from "@/utilities/highlight-code";

export function FortroendeEndPage({ blocks }: ModuleDataFragment) {
  const [heading, setHeading] = useState<string | null>(null);
  const { setBreadcrumb } = useContext(SettingsContext);
  const pathname = usePathname();
  const t = useTranslations();

  const getHeading = () => {
    const first = getFragmentData(
      BlockDataFragment,
      blocks[0] as FragmentType<typeof BlockDataFragment>,
    );
    if (first?.__typename === "dataportal_Digg_Text") {
      const textData = getFragmentData(TextFragment, first);
      const str = textData.heading;
      textData.heading = null;
      return str;
    }
    return null;
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
        <AppLink
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
        </AppLink>
      </div>
    </Container>
  );
}
