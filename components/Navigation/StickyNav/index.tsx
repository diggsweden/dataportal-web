import Link from "next/link";
import Heading from "@/components/global/Typography/Heading";
import { useEffect, useRef, useState } from "react";

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

const StickyNav: React.FC<StickyNavProps> = ({ menuItems, menuHeading }) => {
  const [latestActiveItem, setLatestActiveItem] = useState<WatchedItem | null>(
    null,
  );
  const [fixedNav, setFixedNav] = useState<{
    top: boolean;
    bottom: boolean;
    bottomPosition: string;
  }>({
    top: false,
    bottom: false,
    bottomPosition: "",
  });
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

  useEffect(() => {
    const handleScroll = () => {
      const stickyNav = document.getElementById("stickyNav");
      const navBox = document.getElementById("navBox");

      if (navBox && stickyNav) {
        const navRect = stickyNav.getBoundingClientRect();
        const navBoxRect = navBox.getBoundingClientRect();

        setFixedNav({
          top: navRect.top < 97 && window.scrollY <= navRect.height,
          bottom: window.scrollY > navRect.height,
          bottomPosition: `${navRect.height - navBoxRect.height - 40}px`,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fixedNav]);

  return (
    <div
      id="navBox"
      className={`mb-xl flex flex-col gap-md lg:w-[132px] ${
        fixedNav.top
          ? "lg:fixed lg:top-[96px]"
          : fixedNav.bottom
          ? "lg:absolute"
          : "static"
      }`}
      style={{ top: fixedNav.bottom ? fixedNav.bottomPosition : "" }}
    >
      <Heading level={3} size={"xs"} className="text-brown-600">
        {menuHeading}
      </Heading>
      <ul className={`flex w-full flex-col`}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className={`inline-flex cursor-pointer p-sm pl-lg text-sm no-underline underline-offset-4 hover:underline ${
                latestActiveItem?.id === item.id
                  ? "border-l-[3px] border-pink-600 pl-[18px] font-strong"
                  : "border-l  border-brown-200 font-normal"
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

export default StickyNav;
