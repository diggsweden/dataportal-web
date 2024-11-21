import { GetServerSideProps } from "next/types";

export default function Specification() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const specification = (params?.specification as string[]) || [];
  const scheme = specification[0];

  if (scheme != "http" && scheme != "https") {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  const curi = specification.slice(1).join("/");
  const entryUri = `${scheme}://${curi}`;

  return {
    redirect: {
      destination: `/externalspecification?resource=${encodeURIComponent(
        entryUri,
      )}`,
      permanent: true,
    },
  };
};
