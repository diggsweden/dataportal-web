import { notFound } from "next/navigation";

import { PublicationFull } from "@/features/publication/publication-full";
import { getGoodExample } from "@/utilities";

type Props = { params: { locale: string; slug: string } };

export default async function GoodExamplePage({ params }: Props) {
  const { locale, slug } = params;

  const result = await getGoodExample(
    `/${slug}`,
    locale,
    { revalidate: true },
    true,
  );
  if (!("props" in result) || ("notFound" in result && result.notFound)) {
    notFound();
  }

  return <PublicationFull {...result.props} />;
}
