import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useContext, useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { SearchHit } from "@/features/search/search-hit";
import { EntrystoreContext } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { linkBase } from "@/utilities";

export const DatasetSeriesPage: FC = () => {
  const { pathname } = useRouter() || {};
  const { setBreadcrumb } = useContext(SettingsContext);
  const entry = useContext(EntrystoreContext);
  const { t } = useTranslation();

  useEffect(() => {
    setBreadcrumb?.({
      name: entry.title,
      crumbs: [
        { name: "start", link: { ...linkBase, link: "/" } },
        {
          name: t("routes|datasets$title"),
          link: { ...linkBase, link: `/${t("routes|datasets$path")}?q=&f=` },
        },
      ],
    });
  }, [pathname, entry]);

  return (
    <div>
      <div className="py-lg">
        <Container>
          <Heading level={1} size="lg" className="mb-none">
            {entry.title}
          </Heading>
          {entry.description && (
            <div className="my-md text-md text-textSecondary">
              {entry.description}
            </div>
          )}
          {entry.publisher && (
            <div className="text-md font-strong">{entry.publisher}</div>
          )}
        </Container>
      </div>

      <div className="mt-lg bg-white py-lg">
        <Container>
          <ul className="search-result-list space-y-xl">
            {entry.datasetsInSeries?.map((dataset) => (
              <SearchHit key={dataset.url} hit={dataset} isCompact={true} />
            ))}
          </ul>
        </Container>
      </div>
    </div>
  );
};
