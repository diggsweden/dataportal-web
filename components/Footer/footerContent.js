import externalLink from "../../assets/icons/external-link.svg";
import mail from "../../assets/icons/mail.svg";

export const footerContent = [
  {
    title: "dataportal",
    children: [
      {
        title: "about-website",
        href: "/om-webbplatsen",
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
