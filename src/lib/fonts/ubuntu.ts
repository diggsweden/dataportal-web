import localFont from "next/font/local";

export const ubuntu = localFont({
  src: [
    {
      path: "../../../public/fonts/Ubuntu/Ubuntu-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ubuntu/Ubuntu-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ubuntu/Ubuntu-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ubuntu/Ubuntu-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ubuntu",
  display: "swap",
});
