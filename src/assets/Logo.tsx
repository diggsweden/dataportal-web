import React from 'react';
import i18n from 'i18n';
import { LogoSE } from './LogoSE';
import { LogoEN } from './LogoEN';

const title = i18n.t('common|logo-alt-title');
const titleID = 'LogoID';

export const DataportalLogo: React.FC = () => {
	if(i18n.language === 'en') {
		return <LogoEN title={title} id={titleID} />;
	}
	
	return <LogoSE title={title} id={titleID} />;
};
