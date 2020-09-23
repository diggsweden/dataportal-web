import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import ora from 'ora';
import path from 'path';
import prettyBytes from 'pretty-bytes';
import { promisify } from 'util';
import zlib from 'zlib';
import { renderer, RenderResponseProfileItem } from './renderer';
import { getSitemap } from './SiteMap'
var csp = require('simple-csp');
const app = express();

const cwd = process.cwd();
app.set('port', process.env.PORT || 80);
app.set('basic_auth', process.env.BASIC_AUTH || false);

app.use(compression()); //makes sure we use gzip
app.use(helmet()); //express hardening lib

// Sets "Strict-Transport-Security: max-age=31536000; includeSubDomains".
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: 'preload',
  })
);

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
    'digg-prod-graphproxy.azurewebsites.net'
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

app.use(express.json());

app.use(function forceLiveDomain(req, res, next) {
  var host = req.get('Host');
  if (host === 'beta.dataportal.se' || host === 'dataportal.se') {
    return res.redirect(301, 'https://www.dataportal.se' + req.originalUrl);
  }
  if (host === 'oppnadata.se' || 
      host === 'xn--ppnadata-m4a.se'|| 
      host === 'ckan.xn--ppnadata-m4a.se' || 
      host === 'www.xn--ppnadata-m4a.se' || 
      host === 'ckan.oppnadata.se' || 
      host === 'www.oppnadata.se') {
    return res.redirect(301, 'https://www.dataportal.se/oppnadata');
  }
  if (host === 'oppnadata.local:3003') {
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

//Acme-challange
app.get(['/.well-known/acme-challenge/*'], async (req, res) => {  
  res.sendFile(path.join(cwd, req.path));
});

app.get('*', async (req, res) => {
  const host = req.hostname;
  const url = req.url;

  let body = '';

  let spinner = ora().start(`[___] ${url} Rendering...`);

  try {
    const start = Date.now();

    const result = await renderer(
      host,
      url,
      path.join(cwd, '/dist/client/js/assets.json'),
      '',
      ''
    );

    const end = Date.now();

    res.status(result.statusCode);

    if (result.statusCode === 301 && result.redirectTo) {
      res.redirect(result.redirectTo);
      return;
    }

    body = result.body || '';
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
