import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { dataSet: string } };

export default function DataSet({ params }: Props) {
  const { dataSet } = params;

  if (!dataSet) {
    notFound();
  }

  redirect(`/datasets/${dataSet}`);
}
