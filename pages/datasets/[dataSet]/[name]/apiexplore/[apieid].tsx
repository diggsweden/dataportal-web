import { GetServerSideProps } from "next";

export default function ExploreApiPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const dataSet = params?.dataSet;
  const apieid = params?.apieid;

  if (!dataSet || !apieid) {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  return {
    redirect: {
      destination: `/datasets/${dataSet}/apiexplore/${apieid}`,
      permanent: true,
    },
  };
};
