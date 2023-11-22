import home from "./menu-icons/home.svg";
import data from "./menu-icons/data.svg";
// import datasamverkan from "./menu-icons/datasamverkan.svg";
import delaData from "./menu-icons/dela-data.svg";
import stodVerktyg from "./menu-icons/stod-verktyg.svg";
// import godaExempel from "./menu-icons/goda-exempel.svg";
import nyheter from "./menu-icons/nyheter.svg";
import community from "./menu-icons/community.svg";

export const sideBarConstants = [
  {
    title: "Hem",
    icon: home,
    src: "/",
    external: false,
  },
  {
    title: "Data och API:er",
    icon: data,
    src: "data",
    external: false,
  },
  {
    title: "Stöd och verktyg",
    icon: stodVerktyg,
    children: [
      {
        title: "Stöd och verktyg",
        src: "stod-och-verktyg",
        external: false,
      },
      {
        title: "Kom igång att dela din data",
        src: "dela-data",
        external: false,
      },
    ],
  },
  // {
  //   title: "Goda exempel",
  //   icon: godaExempel,
  //   src: "goda-exempel",
  //   external: false,
  // },
  // {
  //   title: "Datasamverkan",
  //   icon: datasamverkan,
  //   src: "datasamverkan",
  //   external: false,
  // },
  {
    title: "Varför dela data",
    icon: delaData,
    children: [
      {
        title: "Nyttor med datadelning",
        src: "nyttor-med-datadelning",
        external: false,
      },
      {
        title: "Lagstiftning och styrning",
        src: "lagstiftning-och-styrning",
        external: false,
      },
      {
        title: "Internationellt",
        src: "internationellt",
        external: false,
      },
    ],
  },
  {
    title: "Verktyg för självutvärdering",
    icon: nyheter,
    src: "verktyg-for-sjalvutvardering",
    external: false,
  },
  {
    title: "Utbildning för chefer och ledare",
    icon: nyheter,
    src: "utbildning-for-chefer-och-ledare",
    external: false,
  },
  {
    title: "Nyheter",
    icon: nyheter,
    src: "nyheter",
    external: false,
  },
  {
    title: "Community",
    icon: community,
    src: "https://community.dataportal.se/",
    external: true,
  },
];
