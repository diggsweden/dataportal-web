import { getMultiContainer, MultiContainerResponse } from "@/utilities";
import { GetStaticPaths } from "next/types";
import { ContainerPage } from "@/components/pages/Articles";
import { PublicationList } from "@/components/content/PublicationList";
import { useRouter } from "next/router";

export const Page: React.FC<MultiContainerResponse> = ({
  container,
  related,
  category,
  categoryContainers,
  domain,
}) => {
  const router = useRouter();

  if (container) {
    return (
      <ContainerPage
        {...container}
        related={related}
        domain={domain}
        category={category}
      />
    );
  }

  if (category && categoryContainers) {
    return (
      <PublicationList
        type="PublicationList"
        publications={categoryContainers}
        category={category}
        domain={domain}
      />
    );
  }

  router.replace("/404");
  return null;
};

export async function getStaticProps({ params, locale }: any) {
  return await getMultiContainer(params?.containerSlug, locale);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: any[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default Page;
