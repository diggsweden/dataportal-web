import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ dataSet: string; apieid: string }>;
}

export default async function ApiExploreEidRedirect({ params }: PageProps) {
  const { dataSet, apieid } = await params;
  permanentRedirect(`/datasets/${dataSet}/apiexplore/${apieid}`);
}
