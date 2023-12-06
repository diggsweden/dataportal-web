import home from "../../../assets/icons/home.svg";
import data from "../../../assets/icons/data.svg";
import delaData from "../../../assets/icons/dela-data.svg";
import stodVerktyg from "../../../assets/icons/stod-verktyg.svg";
import nyheter from "../../../assets/icons/nyheter.svg";
import community from "../../../assets/icons/community.svg";
import datasamverkan from "../../../assets/icons/datasamverkan.svg";
import godaExempel from "../../../assets/icons/godaExempel.svg";

export const sideBarContent = [
  {
    title: "home-text",
    icon: home,
    external: false,
  },
  {
    title: "search-api",
    icon: data,
    external: false,
  },
  {
    title: "support-tools",
    icon: stodVerktyg,
    children: [
      {
        title: "support-tools",
        external: false,
      },
      {
        title: "share-data",
        external: false,
      },
      {
        title: "use-data",
        external: false,
      },
    ],
  },
  {
    title: "good-examples",
    icon: godaExempel,
    children: [
      {
        title: "good-examples",
        external: false,
      },
      {
        title: "contribute",
        external: false,
      },
    ],
  },
  {
    title: "data-collaboration",
    icon: datasamverkan,
    external: false,
  },
  {
    title: "why-share-data",
    icon: delaData,
    children: [
      {
        title: "shara-data-benefits",
        external: false,
      },
      {
        title: "legislation",
        external: false,
      },
      {
        title: "governance",
        external: false,
      },
    ],
  },
  {
    title: "news",
    icon: nyheter,
    external: false,
  },
  {
    title: "community",
    icon: community,
    external: true,
  },
];