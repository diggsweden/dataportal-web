import { IPuff } from "../components";
import { CategoryFragment } from "../graphql/__generated__/operations";

const areasColors: ColorGroupOverride = {
  accent: "pinkPop", //Color for puff title
  background: "gray800",
};

const themesColors: ColorGroupOverride = {
  accent: "gray900", //Color for puff title
  background: "pinkPop",
};

//todo: Get icons from strapi
let iconInject: any = [
  "bookThin",
  "ehalsodata",
  "elektriskavagar",
  "rymddata",
  "statistik",
  "offentligai",
];

export const populatePuffs = (
  categories: CategoryFragment[],
  type: "dataomraden" | "teman",
): IPuff[] => {
  const isArea = type === "dataomraden";
  return categories.map((category, i) => ({
    title: category.name,
    slug: category.slug,
    colors: isArea ? areasColors : themesColors,
    ...(isArea ? { icon: iconInject[i] } : {}),
  }));
};
