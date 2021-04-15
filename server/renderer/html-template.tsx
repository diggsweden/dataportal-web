import { html } from 'common-tags';
import serialize from 'serialize-javascript';
import generateRandomKey from '../../src/utilities/keyGenerator';

const nonceKey = generateRandomKey(256);

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

  return `<link rel="modulepreload" href="${src}" crossorigin="use-credentials" />`;
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
          <link rel="stylesheet" href="/dist/client/js/font-awesome.min.css" media="print" onload="this.media='all'" type="text/css">                  
          <link href="https://fonts.googleapis.com" rel="preconnect" crossorigin>   
          <link href="https://fonts.googleapis.com" rel="dns-prefetch" crossorigin>         
          <link href="https://admin.dataportal.se" rel="preconnect" crossorigin>
          <link href="https://admin.dataportal.se" rel="dns-prefetch" crossorigin>
          <link href="https://dataportal.azureedge.net" rel="preconnect" crossorigin>
          <link href="https://dataportal.azureedge.net" rel="dns-prefetch" crossorigin>
          <link rel="manifest" crossorigin="use-credentials" href="/dist/client/js/manifest.json">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-16.png" sizes="16x16">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-32.png" sizes="32x32">
          <link rel="icon" type="image/png" href="/dist/client/js/svdp-favicon-64.png" sizes="64x64">
          <link rel="apple-touch-icon" href="/dist/client/js/svdp-favicon-150.png">
          <link rel="apple-touch-icon" sizes="180x180" href="/dist/client/js/svdp-favicon.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/dist/client/js/svdp-favicon.png">
          <link rel="apple-touch-icon" sizes="167x167" href="/dist/client/js/svdp-favicon.png">
          <link rel="mask-icon" href="/dist/client/js/safari-pinned-tab.svg" color="black">            
          <script nonce="${nonceKey}">            
            function loadFont(url) {              
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                  var css = xhr.responseText;
                  css = css.replace(/}/g, 'font-display: swap; }');
                  var head = document.getElementsByTagName('head')[0];
                  var style = document.createElement('style');
                  style.appendChild(document.createTextNode(css));
                  head.appendChild(style);
                }
              };
              xhr.send();
            }
            loadFont('https://fonts.googleapis.com/css?family=Ubuntu:400,500,700&display=swap');
          </script>
          <meta name="og:type" content="website">
          <meta name="og:site_name" content="Sveriges dataportal">                   
          ${styleBundles.map(src => createStyleTag(src))}              
          ${metaTags}                                                  
          <link rel="preload" href="https://dataportal.azureedge.net/cdn/postscribe.min.js" as="script" integrity="sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM" crossorigin="anonymous">                                 
          ${bundles.map(src => createScriptPreload(src))}                                                  
        `;
};

export const getFooter = ({ bundles, ids }: FooterData) => {
  return html`<div id="popup"></div>            
      <script>window.__EMOTION_IDS__ = ${serialize(ids)};</script>                   
      <div id="scriptsPlaceholder"></div>     
      <script nonce=${nonceKey}>
        if (window.appInsights) {
          var aiScript = document.querySelector('script[src="https://az416426.vo.msecnd.net/scripts/a/ai.0.js"]');
          if (aiScript) {
            aiScript.integrity = 'sha384-5No6tpIIf+EesEaiL7XZ15x5q5SpWiiVNvjQw8kZU38+G0UZf/xX52L4mhrBHvy7';
          }
        }        
      </script>
      <script src="https://dataportal.azureedge.net/cdn/postscribe.min.js" integrity="sha384-1nPAWyZS0cvGLWSoWOrkTZAy8Xq8g6llEe985qo5NRPAeDi+F9h9U+0R8v56XWCM" crossorigin="anonymous"></script>           
      ${bundles.map(src => createScriptTag(src))}             
      <script nonce=${nonceKey}>                      
        document.addEventListener("DOMContentLoaded", function() {          
          var matScript = document.querySelector('script[src="https://webbanalys.digg.se/matomo.js"]');
          if (matScript) {
            matScript.integrity = 'sha384-4fKmFD1F5P1mFydTu6egYnDPAI9aIR7CfvjWNlL9zMZ+Kn5DwUyZypqVE+iclsbP';
          }                  
        });
      </script>      
    </body>
    </html>
  `;
};
