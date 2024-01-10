import Image from "next/image";
import React from "react";
import img from "../../public/images/illustration_2.png";
import { responsive } from "../../styles/image";

export const Illustration_2: React.FC = () => {
  return (
    <Image
      src={img}
      alt={"Illustration house"}
      style={responsive}
      width={235}
      height={120}
    />
  );
};
