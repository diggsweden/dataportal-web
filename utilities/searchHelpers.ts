import { BlockData, BlockData_dataportal_Digg_Text, BlockData_dataportal_Digg_Text_text } from "../graphql/__generated__/BlockData";
import { Containers_dataportal_Digg_Containers } from "../graphql/__generated__/Containers";
import { Publication_dataportal_Digg_Publications } from "../graphql/__generated__/Publication";
import { Search_dataportal_Digg_Search, Search_dataportal_Digg_Search_hits } from "../graphql/__generated__/Search";

/**
 * Parse Search_dataportal_Digg_Search  
 * @param hit 
 * @returns 
 */
export const getSearchHit = (hit:Search_dataportal_Digg_Search_hits):SearchHit | null =>
{
    if(hit && hit.hit)
        switch(hit.hit.__typename)    
        {
            case "dataportal_Digg_Container":                
                return {            
                    url: `/${hit.hit.slug}`,
                    title: hit.hit.heading ?? hit.hit.name ?? "-",
                }
            case "dataportal_Digg_Publication":                
                return {            
                    url: `/${hit.hit.slug}`,
                    title: hit.hit.heading ?? hit.hit.name ?? "-",                    
                }
        }
    return null;
}

const aggregateHighlights = (blocks:BlockData[], highlightsMatcher:string) => {
    let text = "";
    
    if(blocks && blocks.length > 0)
    {
        blocks.forEach(b => {
            switch(b.__typename)
            {
                case "dataportal_Digg_Text":
                    if((b as BlockData_dataportal_Digg_Text)?.text?.markdown?.includes(highlightsMatcher))
                    text += (b as BlockData_dataportal_Digg_Text).text.markdown;
            }
        })
    }

    return text;
}