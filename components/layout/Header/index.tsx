import { FC, useEffect } from "react";
import MainNav from "@/components/navigation/MainNav";
import TopNav from "@/components/navigation/TopNav";

type HeaderProps = {
  setOpenSideBar: Function;
  openSideBar: boolean;
};

export const Header: FC<HeaderProps> = ({ openSideBar, setOpenSideBar }) => {
  useEffect(() => {
    return () => {
      window.removeEventListener("resize", () => setOpenSideBar(false));
    };
  }, [openSideBar]);

  return (
    <header className="flex w-screen flex-col gap-md border-b-8 border-b-brown-600 bg-white px-md py-lg md:px-xl">
      <TopNav setOpenSideBar={setOpenSideBar} />
      <MainNav setOpenSideBar={setOpenSideBar} openSideBar={openSideBar} />
    </header>
  );
};

export default Header;
