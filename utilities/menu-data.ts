import communityIcon from "@/assets/icons/community.svg";
import dataIcon from "@/assets/icons/data.svg";
import datasamverkanIcon from "@/assets/icons/datasamverkan.svg";
import externalLinkIcon from "@/assets/icons/external-link.svg";
import globeIcon from "@/assets/icons/globe.svg";
import homeIcon from "@/assets/icons/home.svg";
import infoCircleIcon from "@/assets/icons/info-circle.svg";
import mailIcon from "@/assets/icons/mail.svg";
import newsIcon from "@/assets/icons/news.svg";
import questionCircleIcon from "@/assets/icons/question-circle.svg";
import rocketIcon from "@/assets/icons/rocket.svg";
import starIcon from "@/assets/icons/star.svg";
import { AddIcon } from "@/types/global";

interface NavItem {
  title: string;
  inEn: boolean;
}

export interface NavData {
  title: string;
  promoted?: boolean;
  inEn?: boolean;
  icon?: AddIcon;
  href?: string;
  children?: NavItem[];
}

interface NavTopData {
  title: string;
  icon: AddIcon;
  href?: string;
}

interface NavFooterItem {
  title: string;
  icon?: AddIcon;
  type?: "internal" | "external" | "email" | "cookie";
  href?: string;
}

interface NavFooterData {
  title: string;
  children: NavFooterItem[];
}

const topNav: NavTopData[] = [
  { title: "about-us", icon: infoCircleIcon },
  {
    title: "community",
    href: "https://community.dataportal.se/",
    icon: communityIcon,
  },
  { title: "language", icon: globeIcon },
];

const mainNav: NavData[] = [
  {
    title: "home-text",
    promoted: false,
    inEn: true,
    icon: homeIcon,
  },
  {
    title: "search-api",
    promoted: true,
    inEn: true,
    icon: dataIcon,
  },
  {
    title: "support-tools",
    promoted: true,
    inEn: false,
    icon: infoCircleIcon,
  },
  {
    title: "share-data",
    inEn: false,
    icon: rocketIcon,
  },
  {
    title: "good-examples",
    promoted: true,
    icon: starIcon,
  },
  {
    title: "educations",
    promoted: false,
    inEn: false,
    icon: infoCircleIcon,
  },
  {
    title: "data-collaboration",
    promoted: false,
    inEn: false,
    icon: datasamverkanIcon,
  },
  {
    title: "european-data-areas",
    inEn: false,
    icon: globeIcon,
  },
  {
    title: "why-share-data",
    promoted: false,
    icon: questionCircleIcon,
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
        title: "principles",
        inEn: false,
      },
    ],
  },
  {
    title: "results",
    promoted: false,
    inEn: false,
    icon: infoCircleIcon,
    children: [
      {
        title: "metadata",
        inEn: false,
      },
      {
        title: "open-data-charter",
        inEn: false,
      },
    ],
  },
  {
    title: "news",
    promoted: false,
    inEn: false,
    icon: newsIcon,
  },
  {
    title: "faq",
    promoted: false,
    inEn: false,
    icon: questionCircleIcon,
  },
  {
    title: "community",
    promoted: false,
    inEn: true,
    href: "https://community.dataportal.se/",
    icon: communityIcon,
  },
];

const footerNav: NavFooterData[] = [
  {
    title: "dataportal",
    children: [
      {
        title: "about-website",
        type: "internal",
        icon: externalLinkIcon,
      },
      {
        title: "github",
        href: "https://github.com/DIGGSweden/dataportal-web",
        type: "external",
        icon: externalLinkIcon,
      },
      {
        title: "feedback",
        href: "https://community.dataportal.se/category/4/feedback-p%C3%A5-dataportal-se",
        type: "external",
        icon: externalLinkIcon,
      },
      {
        title: "cookie-settings",
        type: "cookie",
      },
      {
        title: "info@digg.se",
        href: "mailto:info@digg.se",
        type: "email",
        icon: mailIcon,
      },
    ],
  },
  {
    title: "toolbox-share-data",
    children: [
      {
        title: "documentation-services",
        href: "https://docs.dataportal.se/",
        type: "external",
        icon: externalLinkIcon,
      },
      {
        title: "guidance-share",
        href: "https://www.digg.se/utveckling-av-digital-forvaltning/oppna-och-delade-data/offentliga-aktorer",
        type: "external",
        icon: externalLinkIcon,
      },
    ],
  },
];

export { topNav, mainNav, footerNav };
