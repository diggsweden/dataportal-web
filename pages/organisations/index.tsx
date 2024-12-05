import { NextPage } from "next";

import { SearchPageEntryscape } from "@/features/search/search-page/search-page-entryscape";

const OrganisationsPage: NextPage = () => (
  <SearchPageEntryscape searchType="organisations" />
);

export default OrganisationsPage;
