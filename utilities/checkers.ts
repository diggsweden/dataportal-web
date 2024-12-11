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
