import { notFound } from "next/navigation";

import { PublicationFull } from "@/features/publication/publication-full";
import { getNewsItem } from "@/utilities";

type Props = {
  params: { locale: string; slug: string };
};

export default async function NewsItemPage({ params }: Props) {
  const { locale, slug } = params;

  const result = await getNewsItem(`/${slug}`, locale);

  if (!("props" in result) || ("notFound" in result && result.notFound)) {
    notFound();
  }

  return <PublicationFull {...result.props} />;
}
