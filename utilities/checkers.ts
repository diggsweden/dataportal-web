export const isExternalLink = (href: string) => {
  const indicators = ["http", "www.", "mailto"];
  return indicators.some((indicator) => href.includes(indicator));
};

export const isMailLink = (href: string) => {
  return href.includes("mailto");
};
