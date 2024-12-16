import { FC, useEffect } from "react";

import MainNav from "@/components/navigation/main-nav";
import TopNav from "@/components/navigation/top-nav";
import {
  MenuLinkFragment,
  MenuLinkIconFragment,
} from "@/graphql/__generated__/operations";

type HeaderProps = {
  setOpenSideBar: (_param: boolean) => void;
  openSideBar: boolean;
  mainMenu: MenuLinkFragment[];
  serviceMenu: MenuLinkIconFragment[];
};

export const Header: FC<HeaderProps> = ({
  openSideBar,
  setOpenSideBar,
  mainMenu,
  serviceMenu,
}) => {
  useEffect(() => {
    return () => {
      window.removeEventListener("resize", () => setOpenSideBar(false));
    };
  }, [openSideBar]);

  return (
    <header className="flex w-full flex-col gap-md border-b-8 border-b-brown-600 bg-white px-md py-lg md:px-xl">
      <TopNav serviceMenu={serviceMenu} setOpenSideBar={setOpenSideBar} />
      <MainNav
        mainMenu={mainMenu}
        setOpenSideBar={setOpenSideBar}
        openSideBar={openSideBar}
      />
    </header>
  );
};

export default Header;
