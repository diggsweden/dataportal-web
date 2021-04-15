export const getLocalizedValue = (metadataGraph:any, prop:any, lang:string) => {

    let val = '';
    let fallbackLang = 'en';

    const stmts = metadataGraph.find(null, prop);
    if (stmts.length > 0) {      
      const obj:any = {};
      for (let s = 0; s < stmts.length; s++) {
        obj[stmts[s].getLanguage() || ''] = stmts[s].getValue();
      }

      if(typeof obj[lang] != "undefined")
      {        
        val = obj[lang];
      }
      else if(obj[fallbackLang] && fallbackLang != lang)
      {       
        val = obj[fallbackLang];
      }
      else
      {        
        val = Object.entries(obj)[0][1] as string;
      }
    }

    return val;
  };