/** SVG path data for the icons shared across Entryscape template markup. */
const ICON_PATH = {
  download:
    "M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z",
  arrow: "M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z",
  external:
    "M14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3M19 19H5V5H12V3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12H19V19Z",
  chevronDown: "M18 10L12 16L6 10L7.4 8.6L12 13.2L16.6 8.6L18 10Z",
  chevronUp: "M6 14L12 8L18 14L16.6 15.4L12 10.8L7.4 15.4L6 14Z",
} as const;

/**
 * SVG icon markup for Entryscape Handlebars templates. Fixed 24px,
 * `fill='currentColor'` (follows text colour), single-quoted so it can sit
 * inside a double-quoted `{{link content="…"}}`. `extraClass` adds svg classes.
 */
export function esbIcon(name: keyof typeof ICON_PATH, extraClass = ""): string {
  const cls = extraClass ? `${extraClass} flex-shrink-0` : "flex-shrink-0";
  return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' class='${cls}'><path d='${ICON_PATH[name]}' fill='currentColor'/></svg>`;
}
