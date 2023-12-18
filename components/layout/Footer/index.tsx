import React from "react";
import DiggLogo from "@/assets/logos/diggLarge.svg";
import { NavFooter } from "@/components/navigation/Nav/NavFooter";
import Container from "../Container";

type FooterProps = {
  openNavSide: boolean;
  setOpenNavSide: Function;
};

export const Footer: React.FC<FooterProps> = ({
  openNavSide,
  setOpenNavSide,
}) => {
  return (
    <footer className="mt-xl bg-white py-xl">
      <div
        className={`transition-all duration-300 ease-in-out ${
          openNavSide ? "lg:w-[calc(100vw-300px)]" : "w-full"
        }`}
      >
        <Container className="space-y-2xl">
          <NavFooter setOpenNavSide={setOpenNavSide} />

          <DiggLogo />
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
