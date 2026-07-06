const SCROLL_POS_PREFIX = "ScrollPosY_" as const;

export function getScrollKey(search: string): string {
  return `${SCROLL_POS_PREFIX}${search}`;
}

export function saveCurrentScrollPos(): void {
  if (typeof window === "undefined") return;
  const key = getScrollKey(window.location.search);
  localStorage.setItem(key, window.scrollY.toString());
}

export function clearCurrentScrollPos(): void {
  if (typeof window === "undefined") return;
  const key = getScrollKey(window.location.search);
  localStorage.removeItem(key);
}
