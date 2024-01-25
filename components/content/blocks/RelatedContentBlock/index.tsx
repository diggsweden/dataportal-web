import { FC } from "react";
import BookIcon from "@/assets/linkIcons/book.svg";
import CarIcon from "@/assets/linkIcons/car.svg";
import HeartIcon from "@/assets/linkIcons/heart.svg";
import PieChartIcon from "@/assets/linkIcons/pieChart.svg";
import PlanetIcon from "@/assets/linkIcons/planet.svg";
import AIIcon from "@/assets/linkIcons/ai.svg";
import { PromoProps, Promo } from "@/components/content/Promo";

interface RelatedContentProps {
  links: PromoProps[] | any;
  inline?: boolean;
  icons?: boolean;
}

export const RelatedContentBlock: FC<RelatedContentProps> = ({
  links,
  icons,
  inline,
}) => {
  const linkIcons = [
    { icon: BookIcon, label: "Kompetens och livslångt lärande" },
    { icon: HeartIcon, label: "Bilddata" },
    { icon: CarIcon, label: "Elektrifieringen av transportsektorn" },
    { icon: PlanetIcon, label: "Rymddata" },
    { icon: PieChartIcon, label: "Smart statistik" },
    { icon: AIIcon, label: "OffentligAI" },
  ];

  return (
    <ul
      className={`my-xl grid grid-flow-row auto-rows-fr md:grid-cols-2 ${
        icons ? "gap-xl" : "gap-lg"
      } ${inline && !icons ? "max-w-md" : "lg:grid-cols-3"}`}
    >
      {links.map((link: PromoProps, idx: number) => {
        const iconIndex = linkIcons.findIndex(
          (icon) => icon.label === link.title,
        );
        return (
          <li key={idx}>
            <Promo
              icon={icons && linkIcons[iconIndex].icon}
              link={link}
              inline={inline}
            />
          </li>
        );
      })}
    </ul>
  );
};
