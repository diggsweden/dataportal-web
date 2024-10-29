import { GetServerSideProps } from "next/types";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const concept = (params?.concept as string[]) || [];
  const scheme = concept[0];

  if (scheme != "http" && scheme != "https") {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  const curi = concept.slice(1).join("/");
  const uri = `${scheme}://${curi}`;

  return {
    redirect: {
      destination: `/externalconcept?resource=${encodeURIComponent(uri)}`,
      permanent: true,
    },
  };
};

export default function Concept() {
  return null;
}
