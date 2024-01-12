import { NextPage } from "next";
import { SearchPageEntryScape } from "@/components/content/Search/SearchPage/SearchPageEntryScape";

const TerminologyPage: NextPage = () => (
  <SearchPageEntryScape searchType="concepts" />
);

export default TerminologyPage;
