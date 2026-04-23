import { type Ref, type RefObject, useEffect, useRef } from "react";

export const useClickOutside = <T extends HTMLElement>(
  onClickOutside: () => void,
  excludedSelectors: string[] = [],
  existingRef?: RefObject<T | null>,
): Ref<T> => {
  const defaultRef = useRef<T | null>(null);
  const ref = existingRef || defaultRef;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isExcluded = excludedSelectors.some((selector) =>
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

  return ref as Ref<T>;
};
