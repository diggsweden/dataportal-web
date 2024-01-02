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
    },
    maxWidth: {
      sm: 160,
      md: 620,
      lg: 960,
      xl: 1140,
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
        200: "#DBD7D6",
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
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "20px",
      xl: "40px",
      "2xl": "80px",
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
      normal: 400,
      strong: 500,
    },
    fontSize: {
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px/20px
      md: ["1rem", { lineHeight: "1.5rem" }], // 16px/24px
      lg: ["1.25rem", { lineHeight: "1.75rem" }], // 20px/28px
      xl: ["1.75rem", { lineHeight: "2.25rem" }], // 28px/36px
      "2xl": ["3rem", { lineHeight: "3.5rem" }], // 48px/56px
    },
  },

  plugins: [require("@tailwindcss/typography")],
};
