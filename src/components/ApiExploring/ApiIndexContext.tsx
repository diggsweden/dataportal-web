import { LoadingPage } from 'pages/LoadingPage';
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet';

export interface ApiIndexProviderProps{
    apiIndexFileUrl:string;
}

export interface ApiIndex{            
    list: (contextid:string,entryid:string) => ApiIndexItem[] | undefined
    findDetection: (contextid:string,entryid:string) => ApiSpecDetection | undefined   
    loading: boolean 
}

export interface ApiIndexItem {    
    contextId: string;
    entryId: string;   
    detections?: ApiSpecDetection[] 
}

export interface ApiSpecDetection{    
    entryId: string;
    apiDefinition: string;
    type?: string;
    version?: string;    
    allowOrigin?: string;
}

const defaultApiData: ApiIndex = 
{
    list: (contextid,entryid) => { return undefined },
    findDetection: (contextid,entryid) => { return undefined },
    loading: false
};

export const ApiIndexContext = React.createContext<ApiIndex>(
    defaultApiData
);

export const ApiIndexProvider: React.FC<ApiIndexProviderProps> = ({
    apiIndexFileUrl,
    children
}) => {

    const [detections, setDetections ] = useState<ApiIndexItem[]>([]);        
    const [loading, setLoading] = useState<boolean>(false);    

    const listByContainer = (contextid:string, containerEntryId:string):ApiIndexItem[] => {
        let result:ApiIndexItem[] = [];
        
        if(contextid && containerEntryId && detections && detections.length > 0)
        {                        
            //any detections in sent in context
            var tmp = detections.filter((d,i) => {                
                return d.contextId == contextid && d.entryId == containerEntryId
            });            
            if(tmp && tmp.length > 0)
                //iterate matches in context
                tmp.forEach((t) => {                                                                         
                    if(!result.includes(t))
                        result.push(t);                    
                })
            return result;
        }

        return [];
    }

    const findFirstMatch = (contextid:string, entryid:string):ApiSpecDetection | undefined => {
        let result:ApiSpecDetection | undefined = undefined;
        
        if(contextid && entryid && detections && detections.length > 0)
        {                        
            //any detections in sent in context
            var tmp = detections.filter((d,i) => {                
                return d.contextId === contextid
            });            
            if(tmp && tmp.length > 0)
            
                //iterate matches in context
                tmp.forEach((t) => {                    

                    if(t.detections)
                    {                        
                        //get any matching context and entry
                        var existing = t.detections.filter((d) => {return d.entryId == entryid && d.allowOrigin != null}) ?? []  
                                              
                        if(existing && existing.length > 0)
                        {
                            result = existing[0];
                            return result;
                        }
                    }

                    return undefined;
                })
        }

        return result;
    }


    defaultApiData.list = listByContainer;
    defaultApiData.findDetection = findFirstMatch;
    defaultApiData.loading = loading;

    useEffect(() =>{              
        if(apiIndexFileUrl && apiIndexFileUrl.length > 0)  
        {        
            setLoading(true);
            fetch(apiIndexFileUrl)
                .then(response => response.json())
                .then(d => {                    
                    setDetections(d.data);                      
                    setLoading(false);
                })
                .catch(() => {        
                    setLoading(false);            
                });            
        }
    },[apiIndexFileUrl])
    
    const getApiDetectionString = () => {
        let result:string[] = [];        
    
        if(detections && detections.length > 0)
        detections.forEach((l) => {
          if(l.detections && l.detections.length > 0)
            l.detections.forEach((det) => {
              var tmp = `'${l.contextId}_${det.entryId}'`
              if(!result.includes(tmp) && det.allowOrigin != null)
                result.push(tmp);
            })
        });    
    
        return `window.__es_has_apis = [${result.join(',')}]`;        
      }
    
    return (
        <ApiIndexContext.Provider value={defaultApiData}>
            <Helmet script={[{ 
                type: 'text/javascript', 
                innerHTML: getApiDetectionString()
            }]}  />  
            {children}            
        </ApiIndexContext.Provider>
    );
};