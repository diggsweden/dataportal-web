import { Heading } from '@digg/design-system';
import React from 'react';
import { PuffBlock as IPuffBlock } from '../../graphql/__generated__/PuffBlock';
import { checkLang } from '../../utilities/checkLang';
import { ArticleBlock } from './ArticleBlock';

export const PuffBlock: React.FC<IPuffBlock> = ({ heading, description, puffs }) => {
  return (
    <>
      {heading && (
        <Heading
          level={2}
          size="lg"
        >
          {checkLang(heading)}
        </Heading>
      )}
      {description && <p className="text-md">{checkLang(description)}</p>}
      {puffs && <ArticleBlock articles={puffs} />}
    </>
  );
};
