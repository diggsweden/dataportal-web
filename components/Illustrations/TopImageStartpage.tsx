import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import React from 'react';
import startImg from '../../public/images/TopImageStartpage.jpg';

export const TopImageStartpage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <Image
      src={startImg}
      alt={'Startimage city skyline'}
      layout="fill"
      priority={true}
    />
  );
};
