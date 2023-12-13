import Image from "next/image";
import React from "react";
import img from "../../public/images/illustration_2.png";

export const Illustration_2: React.FC = () => {
  return (
    <Image src={img} alt={"Illustration house"} width={235} height={120} />
  );
};
