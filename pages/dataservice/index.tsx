import { NextPage } from "next";
import { SearchPageEntryScape } from "@/components/content/Search/SearchPage/SearchPageEntryScape";

const DataServicePage: NextPage = () => (
  <SearchPageEntryScape searchType="datasets" />
);

export default DataServicePage;
