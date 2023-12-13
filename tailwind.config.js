/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media",
  theme: {
    screens: {
      sm: "0px",
      md: "600px",
      lg: "1124px",
    },
    maxWidth: {
      sm: 140 + 20,
      md: 580 + 40,
      lg: 920 + 40,
      xl: 1160 + 40,
    },
    colors: {
      white: "#FFFFFF",
      transparent: "#00000000",
      whiteOpaque5: "#FFFFFFE6",
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
    borderRadius: {
      sm: "0",
      md: "0",
      lg: "0",
      full: "9999px",
    },
    fontFamily: {
      ubuntu: ["Ubuntu", "sans-serif"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px/16px
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px/20px
      md: ["1rem", { lineHeight: "1.5rem" }], // 16px/24px
      lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px/28px
      xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px/28px
      "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px/32px
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px/36px
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px/40px
      "5xl": ["3rem", { lineHeight: "3.5rem" }], // 48px/56px
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
