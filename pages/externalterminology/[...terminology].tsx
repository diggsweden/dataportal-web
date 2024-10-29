import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const terminology = (params?.terminology as string[]) || [];
  const scheme = terminology[0];

  if (scheme != "http" && scheme != "https") {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  const curi = terminology.slice(1).join("/");
  const entryUri = `${scheme}://${curi}`;

  return {
    redirect: {
      destination: `/externalterminology?resource=${encodeURIComponent(
        entryUri,
      )}`,
      permanent: true,
    },
  };
};

export default function Terminology() {
  return null;
}
