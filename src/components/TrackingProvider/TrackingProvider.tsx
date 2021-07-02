import { createInstance, MatomoProvider } from '@datapunt/matomo-tracker-react';
import React, { useContext, useState } from 'react';
import { SettingsContext } from '../SettingsProvider';

export interface ITrackingContext {
	activateMatomo: Boolean;
	setActivation: React.Dispatch<React.SetStateAction<Boolean>>;
}

export interface ITrackingContextProps {
	initalActivation: Boolean;
}

export const TrackingContext = React.createContext<ITrackingContext>({
	activateMatomo: false,
	setActivation: (value: React.SetStateAction<Boolean>) => { }
});

export const TrackingProvider: React.FC<ITrackingContextProps> = ({
	initalActivation,
	children,
}) => {
	const [activate, setActivation] = useState(initalActivation);
	const { env } = useContext(SettingsContext);
	return (
		<TrackingContext.Provider value={{ activateMatomo: activate, setActivation }}>
			{activate ? <MatomoProvider
				value={createInstance({
					urlBase: 'https://webbanalys.digg.se',
					siteId: env.MATOMO_SITEID > 0
						? env.MATOMO_SITEID
						: -1,
				})}
			>
				{children}
			</MatomoProvider> :
				<>
					{children}
				</>
			}
		</TrackingContext.Provider>
	)
};