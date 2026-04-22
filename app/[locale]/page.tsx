import { StartPage } from "@/features/pages/start-page";
import { getStartPage } from "@/utilities";

type Props = {
  params: { locale: string };
};

export default async function Page({ params }: Props) {
  const { locale } = params;

  const result = await getStartPage(locale);
  const props = result.props;

  return <StartPage {...props} />;
}
