import Image from 'next/image';
import React from 'react';
import startImg from '../../public/images/TopImageStartpage.jpg';

export const TopImageStartpage: React.FC = () => {
  return (
    <Image
      src={startImg}
      alt={'Startimage city skyline'}
      fill
    />
  );
};
