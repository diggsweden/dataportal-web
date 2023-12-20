import { FC } from "react";
import { ButtonLink } from "@/components/global/Button";
import Heading from "@/components/global/Typography/Heading";
import ArrowRightIcon from "@/assets/icons/arrowRight.svg";
import BookIcon from "@/assets/linkIcons/book.svg";
import CarIcon from "@/assets/linkIcons/car.svg";
import HeartIcon from "@/assets/linkIcons/heart.svg";
import PieChartIcon from "@/assets/linkIcons/pieChart.svg";
import PlanetIcon from "@/assets/linkIcons/planet.svg";
import useTranslation from "next-translate/useTranslation";

export interface LinksBlockProps {
  title: string;
  slug: string;
  description?: string;
  linktype?: string;
}

const LinksBlock: FC<{
  links: LinksBlockProps[];
  icons?: boolean;
  inline?: boolean;
}> = ({ links, icons, inline }) => {
  const { t } = useTranslation("common");

  const linkIcons = [
    BookIcon,
    HeartIcon,
    CarIcon,
    PlanetIcon,
    PieChartIcon,
    PieChartIcon,
  ];

  return (
    <ul
      className={`grid grid-flow-row auto-rows-fr py-xl md:grid-cols-2 lg:grid-cols-3 ${
        icons ? "gap-xl" : "gap-lg"
      }`}
    >
      {links.map((link: LinksBlockProps, idx: number) => {
        const Icon = linkIcons[idx];
        return (
          <li key={idx} className="flex flex-col bg-white">
            {icons && (
              <div className="flex justify-center bg-pink-600">
                <Icon />
              </div>
            )}
            <div className="flex h-full flex-col bg-white p-lg">
              <Heading size="h5" className={inline ? "pb-lg" : ""}>
                {link.title}
              </Heading>
              {!inline && (
                <p className="pb-lg pt-sm text-brown-600">{link.description}</p>
              )}
              <ButtonLink
                href={link.slug}
                label={t("read-more")}
                size="sm"
                className="mt-auto"
                icon={ArrowRightIcon}
                iconPosition="right"
                target={link.linktype === "EXTERNAL" ? "_blank" : "_self"}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default LinksBlock;
