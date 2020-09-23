import React from 'react';
import 'scss/loader/loader.scss';
import i18n from 'i18n';

// const options = [
//   { value: }
// ]


//Loader icon, used on serchpage and datasetpage
export const NumberOfHits: React.SFC = () => (
    <div className="search-hits">
      <span className="text-6-bold">
      {i18n.t('pages|search|numberofhits')}
      </span>
      <select>
        <option value="20">20</option>
        <option value="40">40</option>
        <option value="60">60</option>
      </select>
    </div>
);

