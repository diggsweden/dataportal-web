import { FC } from "react";
import BookIcon from "@/assets/linkIcons/book.svg";
import CarIcon from "@/assets/linkIcons/car.svg";
import HeartIcon from "@/assets/linkIcons/heart.svg";
import PieChartIcon from "@/assets/linkIcons/pieChart.svg";
import PlanetIcon from "@/assets/linkIcons/planet.svg";
import Promo, { PromoProps } from "../../Promo";

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
  /*   console.log(links); */
  return (
    <ul
      className={`grid grid-flow-row auto-rows-fr py-xl md:grid-cols-2 lg:grid-cols-3 ${
        icons ? "gap-xl" : "gap-lg"
      }`}
    >
      {links.map((link: PromoProps, idx: number) => {
        return (
          <Promo
            key={idx}
            icon={icons && linkIcons[idx]}
            link={link}
            inline={inline}
          />
        );
      })}
    </ul>
  );
};

export default RelatedContentBlock;
