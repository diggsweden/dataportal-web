import { ListPage } from "@/features/pages/list-page";
import { getNewsList, populateSeo } from "@/utilities";

type Props = {
  params: { locale: string };
};

export default async function NyheterPage({ params }: Props) {
  const { locale } = params;

  const result = await getNewsList(locale, {
    seo: {
      ...populateSeo,
      title: "Nyheter - Sveriges Dataportal",
      description: "Nyheter för Sveriges Dataportal",
    },
    basePath: "/nyheter",
    heading: "Nyheter",
    preamble: "Nyheter för Sveriges Dataportal",
    heroImage: {
      __typename: "dataportal_Digg_Image",
      url: "/images/newsHero.png",
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
