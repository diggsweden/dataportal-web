import home from "./menu-icons/home.svg";
import data from "./menu-icons/data.svg";
import utbildning from "./menu-icons/utbildning.svg";
import delaData from "./menu-icons/dela-data.svg";
import stodVerktyg from "./menu-icons/stod-verktyg.svg";
import verktyg from "./menu-icons/verktyg.svg";
import nyheter from "./menu-icons/nyheter.svg";
import community from "./menu-icons/community.svg";

export const sideBarConstants = [
  {
    title: "home-text",
    icon: home,
    href: "lang-path",
    external: false,
    id: 1,
  },
  {
    title: "search-api",
    icon: data,
    href: "/data",
    external: false,
    id: 2,
  },
  {
    title: "support-tools",
    icon: stodVerktyg,
    id: 3,
    children: [
      {
        title: "support-tools",
        href: "/stod-och-verktyg",
        external: false,
        id: 4,
      },
      {
        title: "share-data",
        href: "/dela-data",
        external: false,
        id: 5,
      },
      {
        title: "use-data",
        href: "/anvanda-data",
        external: false,
        id: 6,
      },
    ],
  },
  // {
  //   title: "Goda exempel",
  //   icon: godaExempel,
  //   href: "goda-exempel",
  //   external: false,
  // },
  // {
  //   title: "Datasamverkan",
  //   icon: datasamverkan,
  //   href: "datasamverkan",
  //   external: false,
  // },
  {
    title: "why-share-data",
    icon: delaData,
    id: 7,
    children: [
      {
        title: "shara-data-benefits",
        href: "/nyttor-med-datadelning",
        external: false,
        id: 8,
      },
      {
        title: "legislation",
        href: "/lagstiftning",
        external: false,
        id: 9,
      },
      {
        title: "governance",
        href: "/styrning",
        external: false,
        id: 10,
      },
    ],
  },
  {
    title: "self-assessment-tools",
    icon: verktyg,
    href: "/verktyg-for-sjalvutvardering",
    external: false,
    id: 11,
  },
  {
    title: "training",
    icon: utbildning,
    href: "/utbildning-for-chefer-och-ledare",
    external: false,
    id: 12,
  },
  {
    title: "news",
    icon: nyheter,
    href: "/nyheter",
    external: false,
    id: 13,
  },
  {
    title: "community",
    icon: community,
    href: "https://community.dataportal.se/",
    external: true,
    id: 14,
  },
];
