import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';
import { renderer } from './renderer';
import { getSitemap } from './SiteMap'
import * as basicAuth from 'express-basic-auth'
import i18next from 'i18next';
var csp = require('simple-csp');
var cache = require('memory-cache');
var middleware = require('i18next-http-middleware')
import resources_sv from '../src/translations/sv/resources.json';
import pages_sv from '../src/translations/sv/pages.json';
import resources_en from '../src/translations/en/resources.json';
import pages_en from '../src/translations/en/pages.json';
import routes_sv from '../src/translations/sv/routes.json';
import routes_en from '../src/translations/en/routes.json';
import common_sv from '../src/translations/sv/common.json';
import common_en from '../src/translations/en/common.json';

const app = express();

const cwd = process.cwd();
app.set('port', process.env.PORT || 80);
app.set('basic_auth', true)//process.env.BASIC_AUTH || false);

app.use(compression()); //makes sure we use gzip
app.use(helmet()); //express hardening lib

// Sets "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload;".
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  })
);

i18next.use(middleware.LanguageDetector).init({    
    preload: ['sv', 'en'],
    detection:({
      order:['path','header'],     
      lookupHeader: 'accept-language',
      lookupPath: 'lng',
      lookupFromPathIndex: 0,
    }),    
    resources: {
      sv: {
        resource:resources_sv,
        pages:pages_sv,
        routes: routes_sv,
        common: common_sv
      },
      en: {
        resource:resources_en,
        pages:pages_en,
        routes: routes_en,
        common: common_en
      }
    },
    load: 'languageOnly',
    whitelist:['sv','en'],    
    fallbackLng: {
      'sv-SE':['se'],
      'en-US':['en'],
      'default':['sv']
    },        
    debug: false,    
    keySeparator: '>',
    nsSeparator: '|',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

app.use(
  middleware.handle(i18next, { 
  })
)

app.disable('x-powered-by');

//Setup CSP
var csp_headers = {
  'default-src': ["'none'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    'dataportal.azureedge.net',
    '*.entryscape.com',
    '*.oppnadata.se',
    '*.dataportal.se',
    '*.googleapis.com',
    '*.gstatic.com',
    'digg-test-graphproxy.azurewebsites.net',
    'digg-prod-graphproxy.azurewebsites.net',
    'webbanalys.digg.se'
  ],
  'base-uri': ["'self'"],
  'manifest-src': ["'self'"],
  'img-src': ["'self' data:", '*'],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'dataportal.azureedge.net',
    '*.googleapis.com',
    '*.entryscape.com',
    '*.oppnadata.se',
    '*.dataportal.se',
  ],
  'form-action': ["'self'"],
  'font-src': [
    "'self' data:",
    'dataportal.azureedge.net',
    'fonts.gstatic.com',
    '*.entryscape.com',
    '*.oppnadata.se',
    '*.dataportal.se',
  ],
  'frame-ancestors': ['https://dev.digg.se','https://digg.se','https://www.digg.se'],
  'connect-src': ['*'],
};
app.use('/', function(req, res, done) {
  csp.header(csp_headers, res);
  done();
});

//simple basic auth for some environments
app.use(function(req,res, next)
{
  var host = req.get('Host');
  if(host === 'digg-test-dataportal.azurewebsites.net') {
   basicAuth({
      users: { 'digg': 'opendata' },
      challenge: true,
      realm: 'digg-test-dataportal.azurewebsites.net',
    })(req, res, next);
  }
  else
    next();
});

app.use(express.json());

app.use(function forceLiveDomain(req, res, next) {
  var host = req.get('Host');
  var origUrl = req.originalUrl || '';

  if (host === 'beta.dataportal.se' || host === 'dataportal.se') {
    return res.redirect(301, 'https://www.dataportal.se' + origUrl);
  }
  if (!origUrl.includes("/.well-known/acme-challenge/") &&
      (
      host === 'oppnadata.se' || 
      host === 'xn--ppnadata-m4a.se'|| 
      host === 'ckan.xn--ppnadata-m4a.se' || 
      host === 'www.xn--ppnadata-m4a.se' || 
      host === 'ckan.oppnadata.se' || 
      host === 'www.oppnadata.se' ||
      host === 'vidareutnyttjande.se'
      )
    ) {
    return res.redirect(301, 'https://www.dataportal.se/oppnadata');
  }
  if (!origUrl.includes("/.well-known/acme-challenge/") && host === 'oppnadata.local:3003') {
    return res.redirect(301, 'http://localhost:3003/oppnadata');
  }
  return next();
});

app.use(
  '/dist/client/js',
  express.static(path.join(cwd, '/dist/client/js'), {
    maxAge: '365d',
  })
);

app.use(
  '/dist/client/js/assets',
  express.static(path.join(cwd, '/dist/client/js/assets'), {
    maxAge: '365d',
  })
);

app.use(
  '/dist/client/fonts',
  express.static(path.join(cwd, '/dist/client/fonts'), {
    maxAge: '365d',
  })
);

app.use('/sitemap.xml', getSitemap)

//Robots, sitemap and google site verification
app.get(['/robots.txt','/google*.html','/favicon.ico'], async (req, res) => {  
  res.sendFile(path.join(cwd, req.path));
});

//manifest.json
app.get(['/dist/client/js/manifest.json'], async (req, res) => {  
  res.sendFile(path.join(cwd, req.path));
});

//Acme-challange
app.get(['/.well-known/acme-challenge/*'], async (req, res) => {  
  res.sendFile(path.join(cwd, req.path));
});

const getCacheKey = (url:string, acceptLang:string) => {
  //we wont cache urls with parameters
  let cacheKey = url.includes("?") ? url.split("?")[0] : url;    
  
  //Is item page for crawled data - create cachekey
  if(new RegExp("\/(?<lang>sv|en)\/(?<type>datasets|concepts|specifications)\/.*\/").test(url))
  {
    var r =new RegExp("\/(?<lang>sv|en)\/(?<type>datasets|concepts|specifications)\/.*\/");
    var m =  cacheKey.match(r);
    if(m && m.groups && m.groups.lang && m.groups.type)
    {
      cacheKey = `/${m.groups.lang}/${m.groups.type}/itempages`      
      return cacheKey;
    }
  }

  //if is searchpage - return cachekey
  if(new RegExp("\/(?<lang>sv|en)\/(?<type>datasets|concepts|specifications)").test(url))
    return cacheKey;

  //is item startpage - return cachekey
  if(cacheKey == "/sv" || cacheKey == "/en")
    return cacheKey;
  
  //if no langpart in url check accept-lang and return /sv  or /en
  if(cacheKey == "/" && (acceptLang.includes("sv") || acceptLang.includes("en")))
    return "/" + acceptLang.substring(0,2);

  return "";
}

app.get('*', async (req, res) => {  

  const host = req.hostname;
  const url = req.url;

  let body = '';

  try {
    //true for skipping cache get this request
    var skipCache = url.includes("nocache=true") || url.includes(".");
    //true for clearing server cache
    var clearCache = url.includes("clearcache=true");

    if(clearCache)
      cache.clear();

    let acceptLang = req.acceptsLanguages();

    var cacheKey = getCacheKey(url, acceptLang && acceptLang.length > 0? acceptLang[0] : null);
    var cachedBody = skipCache && cacheKey.length > 0? '' : cache.get(cacheKey);

    if(cachedBody && cachedBody.length > 1)
    {     
      body = cachedBody;
    }
    else {
      const result = await renderer(
        host,
        url,
        path.join(cwd, '/dist/client/js/assets.json'),
        '',
        '',
        null,
        null,
        acceptLang && acceptLang.length > 0? acceptLang[0] : null,
        (req as any).i18n
      );

      res.status(result.statusCode);

      if (result.statusCode === 301 && result.redirectTo) {
        res.redirect(result.redirectTo);
        return;
      }

      body = result.body || '';

      if(result.statusCode == 200 && body && body.length > 0 && cacheKey.length > 0)
        cache.put(cacheKey,body,900000); //cache expire = 15 minutes
    }
  } catch (e) {
    console.error(e);
  }

  res.send(body);
});

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
