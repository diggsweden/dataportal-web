import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ dataSet: string }>;
}

export default async function ApiExploreRedirect({ params }: PageProps) {
  const { dataSet } = await params;
  permanentRedirect(`/datasets/${dataSet}`);
}
