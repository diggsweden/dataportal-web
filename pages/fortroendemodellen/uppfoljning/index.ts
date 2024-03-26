import { FortroendeModulePage } from "@/components/content/Fortroendemodellen/FortroendeModulePage";
import { getModule, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-uppfoljning", locale, {
    seo: {
      ...populateSeo,
      title: "Förtroende uppföljning",
      description:
        "Uppföljning av AI-system som är i drifttagna så förtroende för systemet bibehålls.",
    },
    heading: "Förtroende uppföljning",
  });
}

export default FortroendeModulePage;
