import { html } from 'common-tags';
import serialize from 'serialize-javascript';

const createScriptTag = (src: string) => {
  const module = !src.includes('legacy');

  return `<script ${
    module ? 'type="module" crossorigin="use-credentials"' : 'nomodule defer'
  } src="${src}" ></script>`;
};

const createScriptNoMod = (src: string) => {
  return `<script src="${src}" crossorigin="use-credentials"></script>`;
};

const createScriptPreload = (src: string) => {
  if (src.includes('legacy')) return '';

  return `<link rel="preload" href="${src}" as="script" crossorigin="use-credentials" />`;
};

const createStyleTag = (src: string) => {
  return `<link rel="stylesheet" href="${src}" type="text/css" />`;
};

export type FooterData = {  
  ids: any;
  bundles: string[];  
};

export type HeaderData = {
  metaTags: string;
  bundles: string[];  
  styleBundles: string[];  
  htmlAttributes: string;
};

export const getHeader = ({
  metaTags,
  bundles,
  styleBundles,  
  htmlAttributes,
}: HeaderData) => {
  return html`
      <!DOCTYPE html>
      <html ${htmlAttributes} class="no-focus-outline">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="theme-color" content="#171A21">         
          <meta name="referrer" content="no-referrer">           
          <link href="https://fonts.googleapis.com" rel="preconnect" crossorigin>
          <!--link href="https://fonts.gstatic.com" rel="preconnect" crossorigin-->
          <link href="https://registrera.oppnadata.se" rel="preconnect" crossorigin>
          <link rel="manifest" href="/dist/client/js/manifest.json">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-16.png" sizes="16x16">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-32.png" sizes="32x32">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-64.png" sizes="64x64">
          <link rel="apple-touch-icon" href="/dist/client/js/svdp-favicon-150.png">
          <link rel="apple-touch-icon" sizes="180x180" href="/dist/client/js/svdp-favicon.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/dist/client/js/svdp-favicon.png">
          <link rel="apple-touch-icon" sizes="167x167" href="/dist/client/js/svdp-favicon.png">
          <link rel="mask-icon" href="/dist/client/js/safari-pinned-tab.svg" color="black">  
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700&display=swap" type="text/css">
          <meta name="og:type" content="website">
          <meta name="og:site_name" content="Dataportalen">          
          ${styleBundles.map(src => createStyleTag(src))}              
          ${metaTags}                                       
          <link rel="preload" href="https://dataportal.azureedge.net/cdn/entrystore.4.7.5.modified.js" as="script" crossorigin="anonymous">   
          <link rel="preload" href="https://dataportal.azureedge.net/cdn/rdfjson.4.7.5.modified.js" as="script" crossorigin="anonymous">   
          <link rel="preload" href="https://dataportal.azureedge.net/cdn/postscribe.min.js" as="script" crossorigin="anonymous">       
          <link rel="stylesheet" href="/dist/client/js/font-awesome.min.css">                
          ${bundles.map(src => createScriptPreload(src))}                
          <script>
          /* <![CDATA[ */
          var __entryscape_plugin_config = {"entrystore_base":"https:\/\/registrera.oppnadata.se\/store","entryscape_base":"https:\/\/static.entryscape.com\/blocks\/0.18"};
          /* ]]> */
          </script>                          
        `;
};

export const getFooter = ({ bundles, ids }: FooterData) => {
  return html`<div id="popup"></div>            
      <script>window.__EMOTION_IDS__ = ${serialize(ids)};</script>                   
      <div id="scriptsPlaceholder"></div>     
      <script src="https://dataportal.azureedge.net/cdn/postscribe.min.js" crossorigin="anonymous"></script>      
      <script src="https://dataportal.azureedge.net/cdn/entrystore.4.7.5.modified.js" crossorigin="anonymous"></script>      
      <script src="https://dataportal.azureedge.net/cdn/rdfjson.4.7.5.modified.js" crossorigin="anonymous"></script>      
      ${bundles.map(src => createScriptTag(src))}                        
    </body>
    </html>
  `;
};
