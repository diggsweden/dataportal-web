import React from 'react';
import { Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules } from '../../graphql/__generated__/Containers';
import ContentArea from './ContentArea';

export const Modules: React.FC<
  Containers_dataportal_Digg_Containers_blocks_dataportal_Digg_ModuleList_modules
> = ({ blocks }) => {
  return <ContentArea blocks={blocks || []} />;
};

export default Modules;
