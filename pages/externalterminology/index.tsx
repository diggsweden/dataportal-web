import { NextPage } from "next";
import { SearchPageEntryScape } from "@/components/content/Search/SearchPage/SearchPageEntryScape";

const ExternalTerminologyPage: NextPage = () => (
  <SearchPageEntryScape searchType="concepts" />
);

export default ExternalTerminologyPage;
