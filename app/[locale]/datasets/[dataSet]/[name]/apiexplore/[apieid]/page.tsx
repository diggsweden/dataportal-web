import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { dataSet: string; apieid: string } };

export default function ExploreApiPage({ params }: Props) {
  const { dataSet, apieid } = params;

  if (!dataSet || !apieid) {
    notFound();
  }

  redirect(`/datasets/${dataSet}/apiexplore/${apieid}`);
}
