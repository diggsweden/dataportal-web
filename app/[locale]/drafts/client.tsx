"use client";

import { ContainerPage } from "@/features/pages/container-page";
import { LandingPage } from "@/features/pages/landing-page";
import { PublicationFull } from "@/features/publication/publication-full";
import type { DataportalPageProps } from "@/utilities";

export function DraftClient(props: DataportalPageProps) {
  switch (props.type) {
    case "RootAggregate":
      return <ContainerPage {...props} />;
    case "MultiContainer":
      if (!props.container) return null;
      return props.container.landingPage ? (
        <LandingPage {...props.container} />
      ) : (
        <ContainerPage {...props.container} related={props.related} />
      );
    case "Publication":
      return <PublicationFull {...props} />;
    default:
      return null;
  }
}
