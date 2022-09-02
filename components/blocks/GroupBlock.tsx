import React from 'react';
import { GroupBlock as IGroupBlock } from '../../graphql/__generated__/GroupBlock';
import { renderMarkdown } from '../Renderers';
import { TextBlock } from './TextBlock';
import { TextBlock as ITextBlock } from '../../graphql/__generated__/TextBlock';
import { checkLang } from '../../utilities/checkLang';
import { Heading } from '@digg/design-system';

export const GroupBlock: React.FC<IGroupBlock> = ({ heading, body, blocks }) => {
  return (
    <div className="groupBlock">
      {heading && <Heading level={2}>{checkLang(heading)}</Heading>}
      {body?.markdown && renderMarkdown(body.markdown)}
      {blocks && blocks.length > 0 && (
        <div className="groupBlock--texts">
          {blocks?.map(
            (block) =>
              blocks && (
                <div
                  className="groupBlock--texts-item"
                  key={block?.id}
                >
                  <TextBlock {...(block as ITextBlock)} />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
