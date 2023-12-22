import { FC } from "react";
import BookIcon from "@/assets/linkIcons/book.svg";
import CarIcon from "@/assets/linkIcons/car.svg";
import HeartIcon from "@/assets/linkIcons/heart.svg";
import PieChartIcon from "@/assets/linkIcons/pieChart.svg";
import PlanetIcon from "@/assets/linkIcons/planet.svg";
import Promo, { PromoProps } from "@/components/content/Promo";
import Link from "next/link";

interface RelatedContentProps {
  links: PromoProps[] | any;
  inline?: boolean;
  icons?: boolean;
}

const RelatedContentBlock: FC<RelatedContentProps> = ({
  links,
  icons,
  inline,
}) => {
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
      className={`${icons ? "gap-xl" : "gap-lg"} ${
        inline
          ? "flex list-inside list-disc flex-col gap-none pl-sm text-green-600"
          : "grid list-none grid-flow-row auto-rows-fr py-xl md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {links.map((link: PromoProps, idx: number) => (
        <li key={idx} className={inline ? "" : "flex flex-col bg-white"}>
          {inline ? (
            <Link
              href={link.slug}
              target={link.linktype === "EXTERNAL" ? "_blank" : "_self"}
            >
              {link.title}
            </Link>
          ) : (
            <Promo icon={icons && linkIcons[idx]} link={link} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default RelatedContentBlock;
