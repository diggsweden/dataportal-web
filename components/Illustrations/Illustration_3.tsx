import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import img from '../../public/images/illustration_3.png';

export const Illustration_3: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <Image
      src={img}
      alt={'Illustration cmputer'}
      layout="responsive"
      width={234}
      height={167}
      priority={true}
    />
  );
};
