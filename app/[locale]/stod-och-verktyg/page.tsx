import { ListPage } from "@/features/pages/list-page";
import { getToolsList, populateSeo } from "@/utilities";

export const dynamic = "force-dynamic";

export default async function StodOchVerktygPage() {
  const result = await getToolsList({
    seo: {
      ...populateSeo,
      title: "Stöd och verktyg - Sveriges Dataportal",
      description:
        "Här kan du som dataproducent eller dataanvändare hitta olika fomer av verktyg och stöd för ditt arbete. Målet är att data ska kunna nyttjas som en strategisk resurs för samhället och att det ska vara så enkelt som möjligt att nå dit.",
    },
    basePath: `/stod-och-verktyg`,
    heading: "Stöd och verktyg",
    preamble:
      "Här kan du som dataproducent eller dataanvändare hitta olika fomer av verktyg och stöd för ditt arbete. Målet är att data ska kunna nyttjas som en strategisk resurs för samhället och att det ska vara så enkelt som möjligt att nå dit.",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      url: "/images/stodOchVerktygHero.png",
      name: null,
      alt: null,
      description: null,
      mime: "image/png",
      ext: ".png",
      width: 1200,
      height: 300,
      screen9: { id: "" },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ListPage {...(result.props as any)} />;
}
