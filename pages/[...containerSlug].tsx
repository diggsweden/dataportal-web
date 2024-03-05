import { FC } from "react";
import { GetStaticPaths } from "next/types";
import { useRouter } from "next/navigation";
import { getMultiContainer, MultiContainerResponse } from "@/utilities";
import { ContainerPage } from "@/components/content/ContainerPage";
import { LandingPage } from "@/components/content/LandingPage";

export const Page: FC<MultiContainerResponse> = ({ container, related }) => {
  const router = useRouter();

  if (container) {
    return container.landingPage ? (
      <LandingPage {...container} />
    ) : (
      <ContainerPage {...container} related={related} />
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
