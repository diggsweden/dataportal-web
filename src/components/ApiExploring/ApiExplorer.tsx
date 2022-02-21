import React, { useEffect, useState, useContext, useRef } from 'react';
import { EnvSettings } from '../../../config/env/EnvSettings';
import { ApiIndexContext } from './ApiIndexContext';
import SwaggerUI from "swagger-ui-react"
import 'scss/swagger/swagger.scss'

interface ApiExplorerProps {
  env: EnvSettings;
  contextId: string;
  entryId: string;
}

interface ApiExplorerState {  
}

export const ApiExplorer: React.FC<ApiExplorerProps> = (props) => {

  const [stats, setStats] = useState<ApiExplorerState>({
        apiIndexFileUrl : ""
  });

  const apiIndexContext = useContext(ApiIndexContext);

  const getAPiDetectionUrl= () => {
    var detection = apiIndexContext.findDetection(props.contextId,props.entryId);

    if(detection && detection.apiDefinition)
      return detection.apiDefinition;

    return undefined;
  }

  return (
    <div lang='en'>      
      {apiIndexContext.findDetection(props.contextId,props.entryId) 
        && (<SwaggerUI url={getAPiDetectionUrl()} />)}      
    </div>
  );    

}
