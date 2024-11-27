import communityIcon from "@/assets/icons/community.svg";
import dataIcon from "@/assets/icons/data.svg";
import datasamverkanIcon from "@/assets/icons/datasamverkan.svg";
import delaDataIcon from "@/assets/icons/dela-data.svg";
import externalLinkIcon from "@/assets/icons/external-link.svg";
import globeIcon from "@/assets/icons/globe.svg";
import godaExempelIcon from "@/assets/icons/godaExempel.svg";
import homeIcon from "@/assets/icons/home.svg";
import mailIcon from "@/assets/icons/mail.svg";
import nyheterIcon from "@/assets/icons/nyheter.svg";
import stodVerktygIcon from "@/assets/icons/stod-verktyg.svg";
import shareData from "@/assets/icons/shareData.svg";
import education from "@/assets/icons/stod-verktyg.svg";
import results from "@/assets/icons/stod-verktyg.svg";

interface NavItem {
  title: string;
  inEn: boolean;
}

interface NavData {
  title: string;
  promoted?: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: NavItem[];
}

interface NavTopData {
  title: string;
  icon: any;
  href?: string;
}

interface NavFooterItem {
  title: string;
  icon?: any;
  type?: "internal" | "external" | "email" | "cookie";
  href?: string;
}

interface NavFooterData {
  title: string;
  children: NavFooterItem[];
}

const topNav: NavTopData[] = [
  { title: "about-us", icon: stodVerktygIcon },
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
    icon: stodVerktygIcon,
  },
  {
    title: "share-data",
    inEn: false,
    icon: shareData,
  },
  {
    title: "good-examples",
    promoted: true,
    icon: godaExempelIcon,
  },
  {
    title: "educations",
    promoted: false,
    inEn: false,
    icon: education,
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
    icon: delaDataIcon,
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
    icon: results,
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
    icon: nyheterIcon,
  },
  {
    title: "faq",
    promoted: false,
    inEn: false,
    icon: delaDataIcon,
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
