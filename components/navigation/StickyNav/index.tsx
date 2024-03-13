import Link from "next/link";
import { Heading } from "@/components/global/Typography/Heading";
import { FC, useEffect, useRef, useState } from "react";

interface StickyNavProps {
  menuItems: Anchorlink[];
  menuHeading: string;
}

interface WatchedItem {
  isActive: boolean;
  id: string;
}

const isInView = (element: HTMLElement) => {
  if (typeof window !== "undefined") {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }
  return false;
};

export const StickyNav: FC<StickyNavProps> = ({ menuItems, menuHeading }) => {
  const [latestActiveItem, setLatestActiveItem] = useState<WatchedItem | null>(
    null,
  );
  let timer = useRef(0);

  const watch = () => {
    let watchedItems: WatchedItem[] = [];
    menuItems.map((item) => {
      const element = document.getElementById(item.id);

      if (element) {
        watchedItems.push({
          isActive: isInView(element),
          id: item.id,
        });
      }
    });

    const latestActiveItem = watchedItems.find((item) => item.isActive) || null;

    if (latestActiveItem != null) {
      setLatestActiveItem(latestActiveItem);
    }
  };

  useEffect(() => {
    timer.current = window.setInterval(() => {
      watch();
    }, 100);

    return () => {
      window.clearInterval(timer.current);
    };
  });

  return (
    <div className="w-fit">
      <Heading
        level={2}
        size={"xs"}
        className="focus--outline focus--primary focus--in mb-md !text-md text-brown-600"
      >
        {menuHeading}
      </Heading>
      <ul className={``}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={`focus--in flex cursor-pointer p-sm pl-lg text-sm no-underline underline-offset-4 hover:underline ${
                latestActiveItem?.id === item.id
                  ? "border-l-[3px] border-pink-600 pl-[18px] font-strong"
                  : "focus--underline border-l border-brown-200 font-normal"
              }`}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
