import Image from "next/image";
import React from "react";
import img from "../../public/images/illustration_3.png";

export const Illustration_3: React.FC = () => {
  return (
    <Image src={img} alt={"Illustration cmputer"} width={234} height={167} />
  );
};
