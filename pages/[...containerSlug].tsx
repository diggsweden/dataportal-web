import { FC } from "react";
import { GetStaticPaths } from "next/types";
import { useRouter } from "next/router";
import { getMultiContainer, MultiContainerResponse } from "@/utilities";
import { ContainerPage } from "@/components/content/ContainerPage";
import { ListPage } from "@/components/content/ListPage";

export const Page: FC<MultiContainerResponse> = ({
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
      <ListPage
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
