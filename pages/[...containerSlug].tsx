import { ParsedUrlQuery } from "querystring";

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

export async function getStaticProps({
  params,
  locale,
}: {
  params: ParsedUrlQuery;
  locale: string;
}) {
  return await getMultiContainer(params?.containerSlug as string[], locale);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default Page;
