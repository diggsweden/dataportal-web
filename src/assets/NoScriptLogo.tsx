import React from 'react';

/**
 * This should be moved to the design system.
 * Quick hack to just make it work.
 */

const logo1x = require('./logo.png');
const logo2x = require('./logo@2x.png');

export const NoScriptLogo: React.SFC = () => (
  <noscript>
    <img
      src={logo1x}
      srcSet={`${logo1x} 1x, ${logo2x} 2x`}
      alt="DIGG logotyp"
      width="250"
      height="39"
    />
  </noscript>
);
