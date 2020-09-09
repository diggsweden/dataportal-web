import { RouteComponentProps } from "react-router-dom";
import { RouterContext } from "../../shared/RouterContext";
import { EnvSettings } from '../../config/env/EnvSettings'

export interface PageProps extends RouteComponentProps<any, RouterContext> {  
  env: EnvSettings;
}