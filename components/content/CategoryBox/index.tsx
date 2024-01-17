import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { ButtonLink } from "@/components/global/Button";
import { dataCategories } from "@/utilities/dataCategories";
import { SearchDatasetsPagePath } from "@/utilities";
import useTranslation from "next-translate/useTranslation";

export const CategoryBox: FC = () => {
  const { t, lang } = useTranslation();

  return (
    <div className="my-xl max-w-xl space-y-lg bg-white p-xl md:my-2xl md:space-y-xl md:p-2xl">
      <Heading level={2} size={"lg"} className="text-center text-primary">
        {t("pages|startpage$datasets_by_category")}
      </Heading>

      <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
        {dataCategories.map((category, idx: number) => (
          <li key={idx}>
            <ButtonLink
              className="text-center"
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(`resources|${category.href}`),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                category.href,
              )}
              label={t(`resources|${category.href}`)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
