"use client";

import { useRouter } from "next/navigation";

import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import type { MultiContainerResponse } from "@/utilities";

export function ContainerPageClient({
  container,
  related,
}: MultiContainerResponse) {
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
}
