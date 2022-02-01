import React from 'react';
import { EnvSettings } from "../../../config/env/EnvSettings";
import { SettingsUtil } from "../../../config/env/SettingsUtil";
import { useQuery } from '@apollo/client';
import i18n from '../../i18n';
import { gql } from 'apollo-boost';
import { MenuItem, createNavigationTree } from 'utilities/treeUtils'

export interface SettingsProviderProps{
  applicationUrl: string;
}

export interface MenuRoutes {  
  id: string;
  title: string;
  segment: string;
  parentId: string;
}

export interface Settings {   
  env: EnvSettings;
  noScriptContent: string | null;
  mainmenu?: MenuItem[] | null
  footermenu?: MenuItem[] | null
}

const defaultSettings: Settings = {    
  noScriptContent: '',
  env: SettingsUtil.getDefault()
};

export const SettingsContext = React.createContext<Settings>(
  defaultSettings
);

const MENUS = gql`
query menu($siteurl: String!, $lang: String!) {
  footer :
    tags(siteurl:$siteurl,tagpathscontains:["/tags/footer/"],requireConnectedContent:false, lang:$lang)
      {
        id
        indexOrder
        value    
        title
        tagPath      
        connectedTagPath
        parentID  
        externalUrl
        connectedContents{
          id            
        }        
      }  
  mainmenu:
    tags(siteurl:$siteurl,tagpathscontains:["/tags/mainmenu/"],requireConnectedContent:false, lang:$lang)
        {
          id
          indexOrder
          value    
          title
          tagPath      
          connectedTagPath
          parentID  
          externalUrl
          connectedContents{
            id            
          }        
        }  
  }
`;

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  applicationUrl,
  children,
}) => {  
  if(applicationUrl)
      defaultSettings.env = SettingsUtil.create(applicationUrl);    
  
  const {error, data } = 
    useQuery<{ mainmenu: Array<any>,footer: Array<any> }>(MENUS,{              
        variables:{          
          siteurl: defaultSettings.env.CONTENTBACKEND_SITEURL,
          lang: i18n.languages[0],
        },ssr: true
      });

  return (
    <SettingsContext.Provider
      value={{
        env: defaultSettings.env,
        noScriptContent: defaultSettings.noScriptContent,
        mainmenu: data && data.mainmenu? createNavigationTree(data.mainmenu) : null,
        footermenu: data && data.footer? createNavigationTree(data.footer) : null
        }}
    >          
      {children}
    </SettingsContext.Provider>     
  );
};

// export const SettingsProvider: React.FunctionComponent<SettingsProviderProps> = ({  
//   applicationUrl,
//   children
// }) => {

//     if(applicationUrl)
//       defaultSettings.env = SettingsUtil.create(applicationUrl);    

//     console.log('init');

//     const {loading, error, data } = 
//       useQuery<{ mainmenu: Array<any>,footer: Array<any> }>(MENUS,{
//         variables:{          
//           siteurl: defaultSettings.env.CONTENTBACKEND_SITEURL
//         }
//       });
        
//         return (    
//             <SettingsContext.Provider
//               value={{
//                 env: defaultSettings.env,
//                 noScriptContent: defaultSettings.noScriptContent,
//                 mainmenu: !loading && data && data.mainmenu? 
//                   createNavigationTree(data.mainmenu)
//                   : 
//                   null,
//                 footermenu: !loading && data && data.footer? 
//                   createNavigationTree(data.footer)
//                   : 
//                   null 
//                 }}
//             >          
//               {children}
//             </SettingsContext.Provider>      
//         );
// }
