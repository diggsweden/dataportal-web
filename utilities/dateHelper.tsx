export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv", {
    year: "numeric",
    day: "numeric",
    month: "long",
  });
}

export function formatDateWithTime(date: string) {
  return new Date(date).toLocaleDateString("sv", {
    year: "numeric",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  });
}
