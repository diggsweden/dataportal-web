export const isExternalLink = (href: string) => {
  let isExternal = false;
  const indicators = ["http", "www.", "mailto"];

  indicators.map((indicator) => {
    if (href.includes(indicator)) {
      isExternal = true;
    }
  });

  return isExternal;
};

export const isMailLink = (href: string) => {
  return href.includes("mailto");
};

export const isDev = process.env.NODE_ENV === "development";
export const hasWindow = typeof window !== "undefined";
