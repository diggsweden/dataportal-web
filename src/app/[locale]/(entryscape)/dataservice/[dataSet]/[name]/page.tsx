import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ dataSet: string }>;
}

export default async function DataserviceNameRedirect({ params }: PageProps) {
  const { dataSet } = await params;
  permanentRedirect(`/dataservice/${dataSet}`);
}
