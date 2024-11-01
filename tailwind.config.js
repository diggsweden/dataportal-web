/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      backgroundImage: {
        "nav-pattern": 'url("/assets/icons/navPixels.svg")',
      },
    },
    screens: {
      sm: "0px",
      md: "600px",
      lg: "984px",
      xl: "1124px",
      "2xl": "1200px",
    },
    maxWidth: {
      sm: "10rem", // 160px
      md: "38.75rem", // 620px
      lg: "60rem", // 960px
      xl: "71.25rem", // 1140px
      fit: "fit-content",
    },
    colors: {
      primary: "#CD7A6E",
      textPrimary: "#2B2A29",
      textSecondary: "#6E615A",
      white: "#FFFFFF",
      transparent: "#00000000",
      whiteOpaque5: "#FFFFFFE6",
      brownOpaque5: "#3F3D3CAB",
      blackOpaque3: "#000000EA",
      brown: {
        900: "#2B2A29",
        800: "#3F3D3C",
        600: "#6E615A",
        500: "#99908B",
        400: "#B6AFAD",
        200: "#E2DFDF",
        100: "#F0EFEE",
      },
      green: {
        600: "#556951",
        500: "#879585",
        400: "#ABB5A9",
        200: "#D5DAD4",
        100: "#EEF0EE",
      },
      pink: {
        600: "#CD7A6E",
        500: "#DCA29B",
        400: "#E6BDB8",
        200: "#F3DEDB",
        100: "#FBF2F0",
      },
      orange: {
        600: "#CE8034",
        500: "#DEA673",
        400: "#E7C09B",
        200: "#F3DFCD",
        100: "#FAF2EB",
      },
      red: {
        600: "#B50000",
        400: "#E18E8E",
        50: "#F8EDED",
      },
    },
    spacing: {
      none: "0",
      xs: "0.25rem", // 4px
      sm: "0.5rem", // 8px
      md: "0.75rem", // 12px
      lg: "1.25rem", // 20px
      xl: "2.5rem", // 40px
      "2xl": "5rem", // 80px
    },
    container: ({ theme }) => ({
      center: true,
      padding: {
        DEFAULT: theme("spacing.md"),
        sm: theme("spacing.lg"),
        lg: theme("spacing.xl"),
      },
    }),
    borderRadius: {
      sm: "0",
      md: "0",
      lg: "0",
      full: "9999px",
    },
    fontFamily: {
      ubuntu: ["Ubuntu", "sans-serif"],
    },
    fontWeight: {
      thin: 300,
      normal: 400,
      strong: 500,
    },
    fontSize: {
      sm: ["0.9375rem", { lineHeight: "1.25rem" }], // 15px/20px
      md: ["1rem", { lineHeight: "1.5rem" }], // 16px/24px
      lg: ["1.25rem", { lineHeight: "1.75rem" }], // 20px/28px
      xl: ["1.75rem", { lineHeight: "2.25rem" }], // 28px/36px
      "2xl": ["3rem", { lineHeight: "3.5rem" }], // 48px/56px
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
