import { FC } from "react";
import Image from "next/image";
import DiggLogo from "@/assets/logos/diggLarge.svg";
import { FooterNav } from "@/components/navigation/FooterNav";
import { Container } from "@/components/layout/Container";

type FooterProps = {
  openSideBar: boolean;
  setOpenSideBar: Function;
};

export const Footer: FC<FooterProps> = ({ openSideBar, setOpenSideBar }) => {
  return (
    <footer className="mt-xl border-t-[1px] border-brown-200 bg-white py-xl">
      <div
        className={`transition-all duration-300 ease-in-out ${
          openSideBar ? "xl:w-[calc(100vw-300px)]" : "w-full"
        }`}
      >
        <Container className="space-y-xl md:space-y-2xl">
          <FooterNav setOpenSideBar={setOpenSideBar} />
          <div className="flex flex-col justify-between gap-xl align-top md:flex-row md:gap-none">
            <DiggLogo aria-label="Digg logo" />
            <Image
              src={"/images/europeiskaunionen.png"}
              width={200}
              height={43}
              alt="SV Finansieras av Europeiska unionen logo"
            />
          </div>
        </Container>
      </div>
    </footer>
  );
};
