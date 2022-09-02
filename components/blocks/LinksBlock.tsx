import React from 'react';
import { Links } from '..';
import { Link } from '../../graphql/__generated__/Link';
import { LinksBlock as ILinksBlock } from '../../graphql/__generated__/LinksBlock';

export const LinksBlock: React.FC<ILinksBlock> = ({ links }) => {
  return <Links links={(links as Link[]) || []} />;
};
