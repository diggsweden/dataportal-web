import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface SearchHeaderProps {
  activeLink?: string;
}

//Navigation between data & Api:s, concepts, specifications.
export const SearchHeader: React.FC<SearchHeaderProps> = () => {
  const { t, lang } = useTranslation('pages');
  const { pathname } = useRouter() || {};
  return (
    <div className="search-head">
      <div>
        <Link href={`${lang}/datasets?q=&f=`}>
          <a className={`text-md ${pathname == '/datasets' ? 'active' : ''} `}>
            {t('search$datasets')}
          </a>
        </Link>
      </div>
      <div>
        <Link href={`${lang}/concepts?q=&f=`}>
          <a className={`text-md ${pathname == '/concepts' ? 'active' : ''} `}>
            {t('search$concepts')}
          </a>
        </Link>
      </div>
      <div>
        <Link href={`${lang}/specifications?q=&f=`}>
          <a className={`text-md ${pathname == '/specifications' ? 'active' : ''} `}>
            {t('search$specifications')}
          </a>
        </Link>
      </div>
    </div>
  );
};
