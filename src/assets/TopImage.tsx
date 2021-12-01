import React from 'react';
import i18n from 'i18n';

const topimage = require('./start_bg1.jpg');

export const TopImage: React.SFC = () => <img src={topimage} alt={i18n.t('common|top-image')}/>;
