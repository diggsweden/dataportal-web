import home from "./menu-icons/home.svg";
import data from "./menu-icons/data.svg";
// import utbildning from "./menu-icons/utbildning.svg";
import delaData from "./menu-icons/dela-data.svg";
import stodVerktyg from "./menu-icons/stod-verktyg.svg";
// import verktyg from "./menu-icons/verktyg.svg";
import nyheter from "./menu-icons/nyheter.svg";
import community from "./menu-icons/community.svg";
import datasamverkan from "./menu-icons/datasamverkan.svg";
import godaExempel from "./menu-icons/godaExempel.svg";

export const sideBarContent = [
  {
    title: "home-text",
    icon: home,
    href: "/",
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
  {
    title: "good-examples",
    icon: godaExempel,
    id: 7,
    children: [
      {
        title: "good-examples",
        href: "/goda-exempel",
        external: false,
        id: 8,
      },
      {
        title: "contribute",
        href: "/var-med-och-bidra",
        external: false,
        id: 9,
      },
    ],
  },
  {
    title: "data-collaboration",
    icon: datasamverkan,
    href: "datasamverkan",
    external: false,
  },
  {
    title: "why-share-data",
    icon: delaData,
    id: 10,
    children: [
      {
        title: "shara-data-benefits",
        href: "/nyttor-med-datadelning",
        external: false,
        id: 11,
      },
      {
        title: "legislation",
        href: "/lagstiftning",
        external: false,
        id: 12,
      },
      {
        title: "governance",
        href: "/styrning",
        external: false,
        id: 13,
      },
    ],
  },
  // {
  //   title: "self-assessment-tools",
  //   icon: verktyg,
  //   href: "/verktyg-for-sjalvutvardering",
  //   external: false,
  //   id: 14,
  // },
  // {
  //   title: "training",
  //   icon: utbildning,
  //   href: "/utbildning-for-chefer-och-ledare",
  //   external: false,
  //   id: 15,
  // },
  {
    title: "news",
    icon: nyheter,
    href: "/nyheter",
    external: false,
    id: 14,
  },
  {
    title: "community",
    icon: community,
    href: "https://community.dataportal.se/",
    external: true,
    id: 15,
  },
];
