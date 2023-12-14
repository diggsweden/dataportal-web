import React from "react";
import DiggLogo from "@/assets/logos/diggLarge.svg";
import { MenuFooter } from "@/components/Navigation/Menu/MenuFooter";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-xl bg-white py-xl">
      <div className="container space-y-2xl">
        <MenuFooter />

        <DiggLogo />
      </div>
    </footer>
  );
};

export default Footer;
