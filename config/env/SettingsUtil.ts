import { Settings_Dev } from "./Settings.Dev";
import { Settings_Sandbox } from "./Settings.Sandbox";
import { Settings_Prod } from "./Settings.Prod";
import { Settings_Test } from "./Settings.Test";
import { EnvSettings } from "./EnvSettings";

/**
 * Utility for non secret application runtime settings. 
 * 
 * Prefer this over .env-files to minimize number of builds of the App in our pipeline
 */
export class SettingsUtil {

  //Singleton pattern
  private static current: EnvSettings;    

  private constructor(){}  

  /**
   * Retrieves runtime settings, if none retrieves default
   *    
   */
  public static getCurrent(): EnvSettings {
    if(!SettingsUtil.current){
      this.current = this.getDefault();
    }

    return SettingsUtil.current;    
  }

  /**
   * Retrieves/creates runtime settings for calling application
   * 
   * @param appUrl application Url (http://localhost:8080, https://www.dataportal.se etc..)
   */
  public static create(appUrl:string): EnvSettings {   
    let url = appUrl? appUrl.match(/^(?:http.*?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/g)?.toString() : '';      

    if(url)
    {
      url = url.replace('https://','');
      url = url.replace('http://','');
    }

    switch(url)
    {
      case "www-sandbox.dataportal.se":
        SettingsUtil.current = new Settings_Sandbox();          
        break;
      case "www.dataportal.se":
      case "dataportal.se":
        SettingsUtil.current = new Settings_Prod();          
        break;        
      case "digg-test-dataportal.azurewebsites.net":
        SettingsUtil.current = new Settings_Test();          
        break;
      default:
        SettingsUtil.current = new Settings_Dev();          
        break;
    }          

    return SettingsUtil.current;    
  }

  /**
   * Creates default runtime env config (dev)
   */
  public static getDefault(): EnvSettings {
    this.current = new Settings_Dev();

    return this.current;
  }
}