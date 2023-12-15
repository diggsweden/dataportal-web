import React, { useEffect } from "react";
import NavBottom from "@/components/navigation/NavBottom";
import NavTop from "@/components/navigation/NavTop";

type HeaderProps = {
  setOpenSidebar: Function;
  openSideBar: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  openSideBar,
  setOpenSidebar,
}) => {
  useEffect(() => {
    return () => {
      window.removeEventListener("resize", () => setOpenSidebar(false));
    };
  }, [openSideBar]);

  return (
    <header className="flex w-screen flex-col gap-md bg-brown-600 px-xl py-lg">
      <NavTop setOpenSidebar={setOpenSidebar} />
      <NavBottom setOpenSidebar={setOpenSidebar} openSideBar={openSideBar} />
    </header>
  );
};

export default Header;
