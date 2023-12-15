import home from "@/assets/icons/home.svg";
import data from "@/assets/icons/data.svg";
import delaData from "@/assets/icons/dela-data.svg";
import stodVerktyg from "@/assets/icons/stod-verktyg.svg";
import nyheter from "@/assets/icons/nyheter.svg";
import community from "@/assets/icons/community.svg";
import datasamverkan from "@/assets/icons/datasamverkan.svg";
import godaExempel from "@/assets/icons/godaExempel.svg";
import globe from "@/assets/icons/globe.svg";
import externalLink from "@/assets/icons/external-link.svg";
import mail from "@/assets/icons/mail.svg";

interface MenuItem {
  title: string;
  inEn: boolean;
}

interface MenuData {
  title: string;
  promoted?: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: MenuItem[];
}

interface TopMenuData {
  title: string;
  icon: any;
  href?: string;
}

interface FooterMenuItem {
  title: string;
  icon: any;
  type?: "internal" | "external" | "email";
  href?: string;
}

interface FooterMenuData {
  title: string;
  children: FooterMenuItem[];
}

const topNav: TopMenuData[] = [
  { title: "about-us", icon: stodVerktyg },
  {
    title: "community",
    href: "https://community.dataportal.se/",
    icon: community,
  },
  { title: "language", icon: globe },
];

const mainNav: MenuData[] = [
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
        inEn: false,
      },
      {
        title: "share-data",
        inEn: false,
      },
      {
        title: "use-data",
        inEn: false,
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
        inEn: false,
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

const footerNav: FooterMenuData[] = [
  {
    title: "dataportal",
    children: [
      {
        title: "about-website",
        type: "internal",
        icon: externalLink,
      },
      {
        title: "github",
        href: "https://github.com/DIGGSweden/dataportal-web",
        type: "external",
        icon: externalLink,
      },
      {
        title: "feedback",
        href: "https://community.dataportal.se/category/4/feedback-p%C3%A5-dataportal-se",
        type: "external",
        icon: externalLink,
      },
      {
        title: "info@digg.se",
        href: "mailto:info@digg.se",
        type: "email",
        icon: mail,
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
        icon: externalLink,
      },
      {
        title: "guidance-share",
        href: "https://www.digg.se/utveckling-av-digital-forvaltning/oppna-och-delade-data/offentliga-aktorer",
        type: "external",
        icon: externalLink,
      },
    ],
  },
];

export { topNav, mainNav, footerNav };
