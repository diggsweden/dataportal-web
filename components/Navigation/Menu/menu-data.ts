import home from "../../../assets/icons/home.svg";
import data from "../../../assets/icons/data.svg";
import delaData from "../../../assets/icons/dela-data.svg";
import stodVerktyg from "../../../assets/icons/stod-verktyg.svg";
import nyheter from "../../../assets/icons/nyheter.svg";
import community from "../../../assets/icons/community.svg";
import datasamverkan from "../../../assets/icons/datasamverkan.svg";
import godaExempel from "../../../assets/icons/godaExempel.svg";

interface MenuItem {
  title: string;
  inEn: boolean;
}

interface MenuData {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: MenuItem[];
}

export const menuData: MenuData[] = [
  {
    title: "home-text",
    promoted: false,
    inEn: true,
    icon: home,
  },
  {
    title: "search-api",
    promoted: true,
    inEn: true,
    icon: data,
  },
  {
    title: "support-tools",
    promoted: true,
    icon: stodVerktyg,
    children: [
      {
        title: "support-tools",
        inEn: true,
      },
      {
        title: "share-data",
        inEn: true,
      },
      {
        title: "use-data",
        inEn: true,
      },
    ],
  },
  {
    title: "good-examples",
    promoted: true,
    icon: godaExempel,
    children: [
      {
        title: "good-examples",
        inEn: true,
      },
      {
        title: "contribute",
        inEn: false,
      },
    ],
  },
  {
    title: "data-collaboration",
    promoted: false,
    inEn: false,
    icon: datasamverkan,
  },
  {
    title: "why-share-data",
    promoted: true,
    icon: delaData,
    children: [
      {
        title: "shara-data-benefits",
        inEn: false,
      },
      {
        title: "legislation",
        inEn: false,
      },
      {
        title: "governance",
        inEn: false,
      },
    ],
  },
  {
    title: "news",
    promoted: false,
    inEn: false,
    icon: nyheter,
  },
  {
    title: "community",
    promoted: false,
    inEn: true,
    href: "https://community.dataportal.se/",
    icon: community,
  },
];
