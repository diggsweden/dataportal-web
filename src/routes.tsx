import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchProvider } from './components/Search';
import { SearchPage } from './pages/SearchPage';
import { SearchTermsPage } from './pages/SearchPage';
import { SearchSpecificationsPage } from './pages/SearchPage';
import { DataSetPage} from './pages/DetailPages';
import { SpecificationPage} from './pages/DetailPages';
import { TermPage} from './pages/DetailPages';
import { AboutWebPage} from './pages/AboutWebPage';
import { AboutWebPageEn} from './pages/AboutWebPage';
import { NotFoundPage} from './pages/NotFoundPage';
import { AccessibilityWebPage } from './pages/AccessibilityWebPage';
import { AccessibilityWebPageEn } from './pages/AccessibilityWebPage';
import { PublishDataPage} from './pages/PublishDataPage';
import { PublishDataPageEn} from './pages/PublishDataPage';
import { ArticleListPage } from './pages/Articles';
import { ArticlePage } from './pages/Articles';

// import i18n from './i18n';
import { StartPage } from './pages/StartPage';
import { StartPageEn } from './pages/StartPage';
import { SettingsContext } from 'components/SettingsProvider';



// i18n.on('languageChanged', function() {
//   const lang = i18n.language;
//   const url = location.pathname;

//   if(lang === 'sv') {
//     location.pathname = url.replace('/en/', '/' + lang + '/');
//   } else {
//     location.pathname = url.replace('/sv/', '/' + lang + '/');
//   }

//   console.log(lang);
//   console.log(url);
  // location.pathname = 
  //(location.pathname === '/en' || '/sv') ? location.pathname = i18n.language + '/' : location.pathname = location.pathname + i18n.language + '/';
// });

export interface RouteProps {
  formdata?: object;
  vars?: object;
}

class RoutesComponent extends React.Component<RouteProps> {
  constructor(props: RouteProps) {
    super(props);
  }

  render() {
    return (
      <ErrorBoundary>
        <SettingsContext.Consumer>
          {settings => (     
            <App>
              <Switch>
                {/* English */}
                <Route path={['/about-webpage' ,'/en/about-webpage']} exact render={(props)=><AboutWebPageEn env={settings.env} {...props}/>} />
                <Route path={['/about-webpage/accessibility', '/en/about-webpage/accessibility']} exact render={(props)=><AccessibilityWebPageEn env={settings.env} {...props}/>} />
                <Route path={['/register-data', '/en/register-data']} exact render={(props)=><PublishDataPageEn env={settings.env} {...props}/>} />
                <Route path={['/articles', '/en/articles']} exact render={(props)=><ArticleListPage env={settings.env} {...props}/>} />
                <Route path={['/articles/:nid/*', '/en/articles/:nid/*','/en/articles/*']} exact render={(props)=><ArticlePage env={settings.env} {...props}/>} />
                <Route path="/en" exact render={(props)=><StartPageEn env={settings.env} {...props}/>} />
                {/* <Route path={['/news', '/en/news']} exact render={(props)=><NewsListPage {...props}/>} /> */}

                {/* Swedish */}
                {/* <Redirect exact from="/" to="/sv/" /> */}

                <Route path={['/nyhets-artikel', '/sv/nyhets-artikel']} exact render={(props)=><ArticlePage env={settings.env} {...props}/>} />
                <Route path={['/artiklar', '/sv/artiklar']} exact render={(props)=><ArticleListPage env={settings.env} {...props}/>} />
                <Route path={['/artiklar/:nid/*', '/sv/artiklar/:nid/*','/sv/artiklar/*']} exact render={(props)=><ArticlePage env={settings.env} {...props}/>} />

                <Route path={['/registrera-data', '/sv/registrera-data']} exact render={(props)=><PublishDataPage env={settings.env} {...props}/>} />
                <Route path={['/om-webbplatsen', '/sv/om-webbplatsen']} exact render={(props)=><AboutWebPage env={settings.env} {...props}/>} />
                <Route path={['/om-webbplatsen/tillganglighet', '/sv/om-webbplatsen/tillganglighet']} exact render={(props)=><AccessibilityWebPage env={settings.env} {...props}/>} />
                {/* dataset, concepts, specifications */}
                <Route path={['/datasets', '/en/datasets', '/sv/datasets']} exact render={(props)=><SearchPage env={settings.env} {...props} />} />
                <Route path={['/specifications', '/sv/specifications', '/en/specifications']} exact render={(props)=><SearchSpecificationsPage env={settings.env} {...props} />} />
                <Route path={['/concepts', '/sv/concepts', '/en/concepts']} exact render={(props)=><SearchTermsPage env={settings.env} {...props} />} />
                <Route path={['/datasets/:cid*_:eid/*', '/en/datasets/:cid*_:eid/*', '/sv/datasets/:cid*_:eid/*']} exact render={(props)=><DataSetPage env={settings.env} {...props}/>} />
                <Route path={['/concepts/:cid*_:eid/*', '/sv/concepts/:cid*_:eid/*', '/en/concepts/:cid*_:eid/*']} exact render={(props)=><TermPage env={settings.env} {...props}/>} />
                <Route path={['/specifications/:cid*_:eid/*', '/sv/specifications/:cid*_:eid/*', '/en/specifications/:cid*_:eid/*']} exact render={(props)=><SpecificationPage env={settings.env} {...props}/>} />
                {/* default */}
                <Route path={['/', '/sv']} exact render={(props)=><StartPage env={settings.env} {...props}/>} />
                <Route render={(props)=><NotFoundPage {...props}/>} />
              </Switch>
            </App>
          )}
        </SettingsContext.Consumer>
      </ErrorBoundary>
    );
  }
}

export const Routes = hot(module)(RoutesComponent);
