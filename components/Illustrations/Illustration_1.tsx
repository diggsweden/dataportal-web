import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import img from '../../public/images/illustration_1.png';

export const Illustration_1: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <Image      
      src={img}
      alt={'Illustration laptop mobile'}
      layout="responsive"
      width={235}
      height={135}
      priority={true}
    />
  );
};
