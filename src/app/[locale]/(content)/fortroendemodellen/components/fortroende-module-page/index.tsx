"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";

import { BlockList } from "@/components/blocks/block-list";
import { TextFragment } from "@/components/blocks/text-block";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { BlockDataFragment } from "@/graphql/fragments";
import { type FragmentType, getFragmentData } from "@/graphql/gql";
import type { ModuleDataFragment } from "@/graphql/gql/graphql";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";
import { highlightCode } from "@/utilities/highlight-code";

export function FortroendeModulePage({ blocks }: ModuleDataFragment) {
  const [heading, setHeading] = useState<string | null>(null);
  const { setBreadcrumb } = useContext(SettingsContext);
  const t = useTranslations();
  const pathname = usePathname();

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

  useEffect(() => {
    setBreadcrumb?.({
      name: heading ?? "",
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
}
