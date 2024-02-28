import { FortroendeEndPage } from "@/components/content/Fortroendemodellen/FortroendeEndPage";
import { getModule, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-end-text", locale, {
    seo: {
      ...populateSeo,
      robotsFollow: false,
      robotsIndex: false,
      title: "Tack för att du slutförde förtroendemodellen",
      description:
        "För att visa upp att ni deltagit så kan ni visa upp förtroendemärkningen på er hemsida.",
    },
    heading: "Tack för att du slutförde förtroendemodellen",
  });
}

export default FortroendeEndPage;
