import { ListPage } from "@/features/pages/list-page";
import { getGoodExamplesList, populateSeo } from "@/utilities";

type Props = { params: { locale: string } };

export default async function TransformationExamplesPage({ params }: Props) {
  const { locale } = params;

  const result = await getGoodExamplesList(locale, {
    reuse: false,
    seo: {
      ...populateSeo,
      title: "Goda exempel - Sveriges Dataportal",
      description: "Goda exempel på datadriven innovation i samhället.",
    },
    basePath: "/exempel-datadriven-transformation",
    heading: "Goda exempel från offentliga aktörer",
    breadcrumb: "Goda exempel",
    preamble:
      "Läs om goda exempel på hur offentliga aktörer arbetar med datadriven transformation.",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      url: "/images/goodExamplesHero.jpg",
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
