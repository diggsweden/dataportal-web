import React from "react";
import DiggLogo from "@/assets/logos/diggLarge.svg";
import { NavFooter } from "@/components/navigation/NavFooter";
import Container from "./Container";

type FooterProps = {
  openSideBar: boolean;
};

export const Footer: React.FC<FooterProps> = ({ openSideBar }) => {
  return (
    <footer className="mt-xl bg-white py-xl">
      <Container
        className={`transition-all duration-300 ease-in-out ${
          openSideBar ? "lg:w-[calc(100vw-300px)]" : "w-full"
        }`}
      >
        <div className="space-y-2xl">
          <NavFooter />

          <DiggLogo />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
