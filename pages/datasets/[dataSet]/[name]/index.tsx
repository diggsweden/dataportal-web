import { GetServerSideProps } from "next";

export default function DataSet() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const dataSet = params?.dataSet;

  if (!dataSet) {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  return {
    redirect: {
      destination: `/datasets/${dataSet}`,
      permanent: true,
    },
  };
};
