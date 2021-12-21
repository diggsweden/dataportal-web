import React from 'react';
import i18n from 'i18n';

const illustration_1 = require('./illustration_1.png');

export const Illustration_1: React.SFC = () => <img src={illustration_1} alt={i18n.t('common|illustration-1')} />;
