import { FC } from "react";
import { Heading } from "@/components/global/Typography/Heading";
import { ButtonLink } from "@/components/global/Button";
import { SearchDatasetsPagePath, isExternalLink } from "@/utilities";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import ExternalLinkIcon from "@/assets/icons/external-link.svg";
import useTranslation from "next-translate/useTranslation";

type ContentBoxProps = {
  heading: string;
  description?: string;
  links?: { href: string; label: string }[];
  categories?: { href: string }[];
};

export const ContentBox: FC<ContentBoxProps> = ({
  heading,
  description,
  links,
  categories,
}) => {
  const { t, lang } = useTranslation();

  return (
    <div className="my-xl max-w-xl space-y-lg bg-white p-xl md:my-2xl md:space-y-xl md:p-2xl">
      <Heading level={2} size={"lg"} className="text-center text-primary">
        {heading}
      </Heading>
      {description && <p className="text-center">{description}</p>}
      {links && (
        <div className="flex flex-wrap justify-center gap-md lg:gap-xl">
          {links.map((link, idx: number) => (
            <ButtonLink
              key={idx}
              href={link.href}
              label={link.label}
              icon={
                isExternalLink(link.href) ? ExternalLinkIcon : ArrowRightIcon
              }
              iconPosition="right"
            />
          ))}
        </div>
      )}
      {categories && (
        <ul className="flex flex-wrap justify-center gap-md lg:gap-lg">
          {categories.map((category, idx: number) => (
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
      )}
    </div>
  );
};
