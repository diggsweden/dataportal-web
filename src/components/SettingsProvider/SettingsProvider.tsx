import React from 'react';
import { EnvSettings } from "../../../config/env/EnvSettings";
import { SettingsUtil } from "../../../config/env/SettingsUtil";

export interface SettingsProviderProps{
  applicationUrl: string;
}

export interface Settings {   
  env: EnvSettings;
  noScriptContent: string | null;
}

const defaultSettings: Settings = {    
  noScriptContent: '',
  env: SettingsUtil.getDefault()
};

export const SettingsContext = React.createContext<Settings>(
  defaultSettings
);

export class SettingsProvider extends React.Component<SettingsProviderProps, {}> {
  constructor(props:any){
    super(props);    

    if(props.applicationUrl)
      defaultSettings.env = SettingsUtil.create(props.applicationUrl);
  }

  render() {
    return (    
        <SettingsContext.Provider
          value={defaultSettings}
        >          
          {this.props.children}
        </SettingsContext.Provider>      
    );
  }
}
