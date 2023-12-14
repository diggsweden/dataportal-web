import Hamburger from "@/public/icons/hamburger.svg";
import React, { useEffect, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { EnvSettings } from "@/env/EnvSettings";
import { usePrevious } from "@/utilities";
import MenuMain from "@/components/Navigation/Menu/MenuMain";
import MenuTop from "@/components/Navigation/Menu/MenuTop";

type HeaderProps = {
  menu: any;
  env: EnvSettings;
  setOpenSidebar: Function;
  openSideBar: boolean;
};

export const Header: React.FC<HeaderProps> = (props) => {
  /* 
  const { pathname } = useRouter() || {};
    const [showSearch, setShowSearch] = useState(pathname === "/");
  const searchRef = useRef<HTMLInputElement>(null);
  const isFirstLoad = previousPathname === undefined; 
  const previousPathname = usePrevious(pathname);
  */

  const handleMenuState = (e: UIEvent) => {
    const screenWidth = (e as any).currentTarget.innerWidth;
    if (screenWidth > 880) {
      props.openSideBar && props.setOpenSidebar(false);
    }
  };

  /*   useEffect(() => {
    const handleFocus = () => !isFirstLoad && searchRef.current?.focus();
    showSearch ? handleFocus() : searchRef.current?.blur();
  }, [showSearch]);

  useEffect(() => {
    !isFirstLoad && setShowSearch(pathname === "/");
  }, [pathname]);
 */
  useEffect(() => {
    return () => {
      window.removeEventListener("resize", (e) => props.setOpenSidebar(false));
    };
  }, [props.openSideBar]);

  console.log(props.openSideBar);
  return (
    <header className="flex flex-col gap-md bg-brown-600 px-xl py-lg">
      <MenuTop setOpenSidebar={props.setOpenSidebar} />

      <MenuMain
        setOpenSidebar={props.setOpenSidebar}
        openSideBar={props.openSideBar}
      />
    </header>
  );
};

export default Header;
