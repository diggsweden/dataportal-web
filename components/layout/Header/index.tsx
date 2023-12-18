import React, { useEffect } from "react";
import NavBottom from "@/components/navigation/Nav/NavBottom";
import NavTop from "@/components/navigation/Nav/NavTop";

type HeaderProps = {
  setOpenNavSide: Function;
  openNavSide: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  openNavSide,
  setOpenNavSide,
}) => {
  useEffect(() => {
    return () => {
      window.removeEventListener("resize", () => setOpenNavSide(false));
    };
  }, [openNavSide]);

  return (
    <header className="flex w-screen flex-col gap-md bg-brown-600 px-xl py-lg">
      <NavTop setOpenNavSide={setOpenNavSide} />
      <NavBottom setOpenNavSide={setOpenNavSide} openNavSide={openNavSide} />
    </header>
  );
};

export default Header;
