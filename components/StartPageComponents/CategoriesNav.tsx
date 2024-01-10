import { Heading } from "@digg/design-system";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { SearchDatasetsPagePath } from "../../utilities";

export const CategoriesNav: React.FC = () => {
  const { t, lang } = useTranslation();
  return (
    <div className="categoriesnav__wrapper text-base">
      <div className="startpage-categories">
        <Heading level={2} size="xl">
          {t("pages|startpage$datasets_by_category")}
        </Heading>
        <ul>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/ENVI",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/ENVI",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/ENVI",
              )}
            </Link>
          </li>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/ECON",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/ECON",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/ECON",
              )}
            </Link>
          </li>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/EDUC",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/EDUC",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/EDUC",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/REGI",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/REGI",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/REGI",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/INTR",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/INTR",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/INTR",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/GOVE",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/GOVE",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/GOVE",
              )}
            </Link>
          </li>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/ENER",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/ENER",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/ENER",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/JUST",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/JUST",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/JUST",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/HEAL",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/HEAL",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/HEAL",
              )}
            </Link>
          </li>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/SOCI",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/SOCI",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/SOCI",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/AGRI",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/AGRI",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/AGRI",
              )}
            </Link>
          </li>

          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/TRAN",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/TRAN",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/TRAN",
              )}
            </Link>
          </li>
          <li>
            <Link
              aria-label={t("pages|startpage$search_datasets_format", {
                category: t(
                  "resources|http://publications.europa.eu/resource/authority/data-theme/TECH",
                ),
              })}
              href={SearchDatasetsPagePath(
                lang,
                "http://www.w3.org/ns/dcat#theme",
                "http://publications.europa.eu/resource/authority/data-theme/TECH",
              )}
            >
              {t(
                "resources|http://publications.europa.eu/resource/authority/data-theme/TECH",
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
