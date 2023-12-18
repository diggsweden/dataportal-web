import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { topNav } from "@/components/navigation/Nav/navData";
import { ButtonLink } from "@/components/global/Button";
import DiggSmall from "@/assets/logos/diggSmall.svg";

interface NavTopData {
  title: string;
  icon: any;
  href?: string;
}

interface NavTopProps {
  setOpenNavSide: Function;
}

const NavTop: FC<NavTopProps> = ({ setOpenNavSide }) => {
  const { t, lang } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex h-[32px] flex-row items-center justify-between">
      <Link href={"https://digg.se/"} target="_blank">
        <DiggSmall />
      </Link>
      <nav>
        <ul className="flex flex-row">
          {topNav.map((menu: NavTopData, idx: number) => (
            <li key={idx} className="group text-sm">
              {menu.href ? (
                <>
                  <ButtonLink
                    href={menu.href}
                    icon={menu.icon}
                    iconPosition="left"
                    label={t(`common|${menu.title}`)}
                    size={"sm"}
                    className="[&_span]:hidden md:[&_span]:block"
                  />
                </>
              ) : (
                <ButtonLink
                  href={`/${t(`routes|${menu.title}$path`)}`}
                  locale={`${menu.title === "language" ? "" : lang}`}
                  onClick={() => setOpenNavSide(false)}
                  icon={menu.icon}
                  iconPosition="left"
                  label={t(`routes|${menu.title}$title`)}
                  size={"sm"}
                  className={`${
                    menu.title !== "language" &&
                    "[&_span]:hidden md:[&_span]:block"
                  }`}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavTop;
