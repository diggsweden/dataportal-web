import { useRouter } from "next/navigation";
import { GetStaticPaths } from "next/types";
import { FC } from "react";

import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { getMultiContainer, MultiContainerResponse } from "@/utilities";

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
