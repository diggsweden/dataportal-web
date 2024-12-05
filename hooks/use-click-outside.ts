import { useEffect, useRef, RefObject } from "react";

export const useClickOutside = <T extends HTMLElement>(
  onClickOutside: () => void,
  excludedSelectors: string[] = [],
  existingRef?: RefObject<T>,
) => {
  const defaultRef = useRef() as RefObject<T>;
  const ref = existingRef || defaultRef;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isExcluded = excludedSelectors.some(
        (selector) =>
          document.querySelector(selector)?.contains(event.target as Node),
      );

      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !isExcluded
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [onClickOutside, excludedSelectors, ref]);

  // Return the ref if no existing ref was provided
  return ref;
};
