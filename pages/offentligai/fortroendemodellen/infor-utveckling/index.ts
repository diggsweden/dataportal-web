import { FortroendeModulePage } from "@/components/content/Fortroendemodellen/FortroendeModulePage";
import { getModule, populateSeo } from "@/utilities";

export async function getStaticProps({ locale }: any) {
  return await getModule("fortroende-infor-utveckling", locale, {
    seo: {
      ...populateSeo,
      title: "Förtroende inför utveckling",
      description:
        "Några utgångspunkter att fundera på då ni ska starta upp ett AI-projekt.",
    },
    heading: "Förtroende inför utveckling",
  });
}

export default FortroendeModulePage;
