import { FC } from "react";
import DiggLogo from "@/assets/logos/diggLarge.svg";
import FooterNav from "@/components/navigation/FooterNav";
import Container from "../Container";

type FooterProps = {
  openSideBar: boolean;
  setOpenSideBar: Function;
};

const Footer: FC<FooterProps> = ({ openSideBar, setOpenSideBar }) => {
  return (
    <footer className="mt-xl bg-white py-xl">
      <div
        className={`transition-all duration-300 ease-in-out ${
          openSideBar ? "lg:w-[calc(100vw-300px)]" : "w-full"
        }`}
      >
        <Container className="space-y-2xl">
          <FooterNav setOpenSideBar={setOpenSideBar} />
          <DiggLogo />
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
