import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { dataSet: string } };

export default function ExploreApiPage({ params }: Props) {
  const { dataSet } = params;

  if (!dataSet) {
    notFound();
  }

  redirect(`/dataservice/${dataSet}`);
}
