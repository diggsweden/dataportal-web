import { NextPage } from "next";
import { SearchPageEntryscape } from "@/features/search/search-page/search-page-entryscape";

const ConceptsPage: NextPage = () => (
  <SearchPageEntryscape searchType="concepts" />
);

export default ConceptsPage;
