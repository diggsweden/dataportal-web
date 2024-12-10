export const keyUp = (e: KeyboardEvent) => {
  if (e.key === "Tab") {
    document.documentElement.classList.remove("no-focus-outline");
  }
};

export const click = () => {
  document.documentElement.classList.add("no-focus-outline");
};
