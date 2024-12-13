import { NextPage } from "next";

import { SearchPageEntryscape } from "@/features/search/search-page/search-page-entryscape";

const DataSetPage: NextPage = () => (
  <SearchPageEntryscape searchType="datasets" />
);

export default DataSetPage;
