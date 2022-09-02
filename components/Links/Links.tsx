import { ArrowIcon } from '@digg/design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { checkLang } from '../../utilities/checkLang';

// Todo - remove any
export const Links: React.FC<{ links: any[] }> = ({ links }) => {
  const router = useRouter();
  return (
    <ul className="text-md font-bold linkblock">
      {links.map((l, index) => (
        <li
          key={index}
          onClick={() => router.push(l.link || '')}
        >
          <Link
            href={`${l?.link}`}
            passHref
          >
            <a>{checkLang(l?.title || l?.link)}</a>
          </Link>
          <ArrowIcon width={24} />
        </li>
      ))}
    </ul>
  );
};

export default Links;
