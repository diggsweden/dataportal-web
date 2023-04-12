import { colorPalette, theme } from "@digg/design-system";

const focusStyle = {
  outline: "3px dotted " + colorPalette.white,
  offset: "3px !important",
};
export const dataportalTheme: DiggTheme = {
  ...theme,
  anchorlinkMenu: {
    accent: colorPalette.pinkPop,
    background: colorPalette.gray900,
    font: colorPalette.white,
    border: colorPalette.gray600,
  },
  background: { light: colorPalette.gray900, dark: colorPalette.black },
  blockQuote: {
    accent: colorPalette.pinkPop,
    background: colorPalette.gray800,
    font: colorPalette.white,
  },
  button: {
    ...theme.button,
    default: {
      normalColors: {
        accent: colorPalette.white,
        border: colorPalette.pinkPop,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      hoverColors: {
        accent: colorPalette.white,
        border: colorPalette.white,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      activeColors: {
        accent: colorPalette.white,
        border: colorPalette.white,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      disabledColors: {
        accent: colorPalette.gray800,
        border: colorPalette.gray800,
        background: colorPalette.gray800,
        font: colorPalette.gray600,
      },
      focus: focusStyle,
    },
    primary: {
      normalColors: {
        accent: colorPalette.gray900,
        border: colorPalette.pinkPop,
        background: colorPalette.pinkPop,
        font: colorPalette.gray900,
      },
      hoverColors: {
        accent: colorPalette.gray900,
        border: "transparent",
        background: colorPalette.white,
        font: colorPalette.gray900,
      },
      activeColors: {
        accent: colorPalette.gray900,
        border: colorPalette.gray900,
        background: colorPalette.pinkPop,
        font: colorPalette.gray900,
      },
      disabledColors: {
        accent: colorPalette.gray800,
        border: colorPalette.gray800,
        background: colorPalette.gray800,
        font: colorPalette.gray600,
      },
      focus: focusStyle,
    },
    secondary: {
      normalColors: {
        accent: colorPalette.white,
        border: colorPalette.pinkPop,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      hoverColors: {
        accent: colorPalette.white,
        border: colorPalette.pinkPop,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      activeColors: {
        accent: colorPalette.white,
        border: colorPalette.pinkPop,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      disabledColors: {
        accent: colorPalette.white,
        border: colorPalette.pinkPop,
        background: colorPalette.gray900,
        font: colorPalette.white,
      },
      focus: focusStyle,
    },
  },
  focus: focusStyle,
  link: {
    normal: colorPalette.white,
    hover: colorPalette.white,
    visited: colorPalette.green800,
    disabled: colorPalette.gray200,
  },
  searchField: {
    normalColors: {
      accent: "rgba(149, 96, 87, 1)",
      border: "rgba(244, 147, 131, 0.10)",
      background: "rgba(244, 147, 131, 0.10)",
      font: colorPalette.white,
    },
    activeColors: {
      accent: colorPalette.gray900,
      border: colorPalette.pinkPop,
      background: "rgba(244, 147, 131, 0.12)",
      font: colorPalette.white,
    },
    hoverColors: {
      accent: colorPalette.gray900,
      border: colorPalette.pink700,
      background: "rgba(244, 147, 131, 0.12)",
      font: colorPalette.white,
    },
    disabledColors: {
      accent: colorPalette.gray500,
      border: colorPalette.gray700,
      background: colorPalette.gray900,
      font: colorPalette.gray500,
    },
    focus: focusStyle,
  },
  text: {
    ...theme.text,
    colors: {
      dark: colorPalette.gray900,
      darkHover: colorPalette.gray700,
      default: colorPalette.white,
      light: colorPalette.white,
      lightHover: colorPalette.gray100,
    },
  },
  accordion: {
    normalColors: {
      accent: colorPalette.green700,
      background: "transparent",
      font: colorPalette.white,
      border: colorPalette.gray600,
    },
    hoverColors: {
      accent: colorPalette.green600,
      background: colorPalette.white,
      font: colorPalette.pinkPop,
      border: colorPalette.gray900,
    },
  },
  CookieBanner: {
    background: colorPalette.gray800,
    font: colorPalette.white,
    settings: {
      background: colorPalette.gray800,
      font: colorPalette.white,
      border: colorPalette.gray700,
      toggle: {
        normalColors: {
          background: colorPalette.gray600,
          pill: colorPalette.white,
        },
        hoverColors: {
          background: colorPalette.gray500,
          pill: colorPalette.white,
        },
        activeColors: {
          background: colorPalette.pinkPop,
          pill: colorPalette.gray700,
        },
        disabledColors: {
          background: colorPalette.gray200,
          pill: colorPalette.gray400,
        },
        disabledActiveColors: {
          background: colorPalette.green500,
          pill: colorPalette.gray500,
        },
        focus: focusStyle,
      },
    },
  },
};
