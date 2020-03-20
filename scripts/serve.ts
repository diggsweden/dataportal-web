import history from 'connect-history-api-fallback';
import convert from 'koa-connect';
import serve from 'webpack-serve'
import config from '../config/webpack.config.development';

const PORT = 8080;

const add = (app:any) => {
  const historyOptions = {};

  app.use(convert(history(historyOptions)));
};

serve(  
  {},
  {
    add,
    config,    
    dev: {
      publicPath: '/',
      stats: config.stats,      
    },
    port:PORT
  }
).then(() => {});
