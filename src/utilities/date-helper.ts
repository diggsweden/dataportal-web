export function formatDate(lang: string, date: string) {
  return new Date(date).toLocaleDateString("sv", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
}

export function formatDateWithTime(lang: string, date: string) {
  return new Date(date).toLocaleDateString("sv", {
    year: "numeric",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    // Pin to the app's configured timeZone so the value is deterministic when
    // rendered on the server (matches i18n/request.ts).
    timeZone: "Europe/Stockholm",
  });
}
