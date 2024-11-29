import { FortroendeIntroPage } from "@/features/fortroendemodellen/fortroende-intro-page";
import { getModule, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroendemodellen", locale, {
    seo: {
      ...populateSeo,
      title: "Förtroendemodellen",
      description:
        "Förtroendemodellen för artificiell intelligens (AI) är ett verktyg för självutvärdering av användningen av AI hos aktörer inom offentlig sektor.",
    },
    basePath: `/fortroendemodellen`,
    heading: "Förtroendemodellen",
  });
}

export default FortroendeIntroPage;
