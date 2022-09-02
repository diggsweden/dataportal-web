import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import img from '../../public/images/illustration_2.png';

export const Illustration_2: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <Image
      src={img}
      alt={'Illustration house'}
      layout="responsive"
      width={235}
      height={120}
      priority={true}
    />
  );
};
