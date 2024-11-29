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
  });
}
