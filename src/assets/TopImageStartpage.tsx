import React from 'react';
import i18n from 'i18n';

const topimage = require('./TopImageStartpage.jpg');

export const TopImageStartpage: React.SFC = () => <img src={topimage} alt={i18n.t('common|top-image')}/>;
