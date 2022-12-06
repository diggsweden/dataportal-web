import Image from 'next/image';
import React from 'react';
import img from '../../public/images/illustration_1.png';
import { responsive } from '../../styles/image';

export const Illustration_1: React.FC = () => {
  return (
    <Image
      src={img}
      alt={'Illustration laptop mobile'}
      style={responsive}
      width={235}
      height={135}
    />
  );
};
