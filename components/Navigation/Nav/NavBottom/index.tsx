import { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import Link from "next/link.js";
import { Button, ButtonLink } from "@/components/global/Button";
import { mainNav } from "@/components/navigation/Nav/navData";
import Dataportal from "@/assets/logos/dataportal.svg";
import CloseCross from "@/assets/icons/closeCross.svg";
import Hamburger from "@/assets/icons/hamburger.svg";

interface NavBottomData {
  title: string;
  promoted: boolean;
  inEn?: boolean;
  icon?: any;
  href?: string;
  children?: NavBottomData[];
}

interface NavBottomProps {
  setOpenNavSide: Function;
  openNavSide: boolean;
}

const NavBottom: FC<NavBottomProps> = ({ setOpenNavSide, openNavSide }) => {
  const [menues, setMenues] = useState<any>([]);
  const { t, lang } = useTranslation();
  const isEn = lang === "en";

  useEffect(() => {
    let enMenu;
    if (isEn) {
      enMenu = mainNav.filter((menu) => menu.promoted && menu.inEn);

      setMenues(enMenu);
    } else {
      enMenu = mainNav.filter((menu) => menu.promoted);
      setMenues(enMenu);
    }
  }, [isEn]);

  return (
    <div className="flex flex-row items-center justify-end md:justify-between">
      <Link
        className="hidden md:block"
        href={t(`common|${"lang-path"}`)}
        onClick={() => setOpenNavSide(false)}
      >
        <Dataportal />
      </Link>
      <div className="flex flex-row items-center">
        <nav className="hidden flex-row items-center gap-sm lg:flex">
          {menues.map((menu: NavBottomData, idx: number) => (
            <ButtonLink
              key={idx}
              href={t(`routes|${menu.title}$path`)}
              onClick={() => setOpenNavSide(false)}
              label={t(`routes|${menu.title}$title`)}
            />
          ))}
        </nav>
        <Button
          icon={openNavSide ? CloseCross : Hamburger}
          iconPosition="left"
          onClick={() => setOpenNavSide(!openNavSide)}
          label={t("common|menu")}
        />
      </div>
    </div>
  );
};

export default NavBottom;
