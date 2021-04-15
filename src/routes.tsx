import React, { useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SearchPage } from './pages/SearchPage';
import { SearchTermsPage } from './pages/SearchPage';
import { SearchSpecificationsPage } from './pages/SearchPage';
import { DataServicePage, DataSetPage} from './pages/DetailPages';
import { SpecificationPage} from './pages/DetailPages';
import { ConceptPage} from './pages/DetailPages';
import { StatisticPage } from './pages/StatisticPage';
import { ArticleListPage } from './pages/Articles';
import { ArticlePage } from './pages/Articles';
// import { ProjectListPage } from './pages/ProjectPage';
// import { ProjectPage } from './pages/ProjectPage';
import { ProjectListPage, ProjectPage, ProjectSubmitPage } from './pages/ProjectPage';
import { RedirectPage} from './pages/RedirectPage';
import { StartPage } from './pages/StartPage';
import { SettingsContext } from 'components/SettingsProvider';
import { ContentRouter } from 'pages/ContentPage';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import i18n from 'i18n';

export interface RouteProps  {
  formdata?: object;
  vars?: object;
}

export const Routes = ({formdata, vars}:RouteProps) => {    

  const { trackPageView } = useMatomo();
  const location = useLocation();  
  
  useEffect(() => {    
    trackPageView({});
  },[location.pathname])  

  return (
    <ErrorBoundary>
      <SettingsContext.Consumer>
        {settings => (     
          <App>
            <Switch>
              
            <Route path={['/oppnadata', '/oppnadata/*' ]} exact render={(props)=><RedirectPage env={settings.env} {...props}/>} />
                {/* English */}                
                <Redirect exact from="/articles" to="/news"/>
                <Redirect exact from="/articles/:nid/*" to="/news/:nid"/>
                <Route path={['/news', '/en/news']} exact render={(props)=><ArticleListPage env={settings.env} {...props}/>} />
                <Route path={['/news/:nid/*', '/en/news/:nid/*','/en/news/*']} exact render={(props)=><ArticlePage env={settings.env} {...props}/>} />                              

                {/* Swedish */}
                <Route path={['/sv/inspiration','/inspiration', '/en/inspiration']} exact render={(props)=><ProjectListPage env={settings.env} {...props}/>} />
                <Route path={['/sv/inspiration/:nid/*','/inspiration/:nid/*', '/en/inspiration/:nid/*','/en/inspiration/*']} exact render={(props)=><ProjectPage env={settings.env} {...props}/>} />

                <Route path={['/sv/tipsaoss','/tipsaoss', '/en/submitproject']} exact render={(props)=><ProjectSubmitPage env={settings.env} {...props}/>} />
                
                <Redirect exact from="/artiklar/:nid/*" to="/nyheter/:nid/*"/>
                <Redirect exact from="/sv/artiklar/:nid/*" to="/sv/nyheter/:nid/*"/>

                <Route path={['/nyheter/:nid/*', '/sv/nyheter/:nid/*','/sv/nyheter/*']} exact render={(props)=><ArticlePage env={settings.env} {...props}/>} />
                <Route path={['/nyheter','/sv/nyheter','/nyheter','/sv/nyheter']} exact render={(props)=><ArticleListPage env={settings.env} {...props}/>} />                                

                <Route path={['/statistik', '/sv/statistik', '/en/statistic', '/en/statistics']} exact render={(props)=><StatisticPage  env={settings.env} {...props}/>} />
                
                {/* dataset, concepts, specifications */}
                <Route path={['/datasets', '/en/datasets', '/sv/datasets']} exact render={(props)=><SearchPage env={settings.env} {...props} />} />
                {/* dataservice */}
                <Route path={['/dataservice', '/en/dataservice', '/sv/dataservice']} exact render={(props)=><SearchPage env={settings.env} {...props} />} />

                <Route path={['/specifications', '/sv/specifications', '/en/specifications']} exact render={(props)=><SearchSpecificationsPage env={settings.env} {...props} />} />
                <Route path={['/concepts', '/sv/concepts', '/en/concepts']} exact render={(props)=><SearchTermsPage env={settings.env} {...props} />} />                
                <Route path={['/datasets/:cid*_:eid/*', '/en/datasets/:cid*_:eid/*', '/sv/datasets/:cid*_:eid/*']} exact render={(props)=><DataSetPage env={settings.env} {...props}/>} />
                
                <Route path={['/dataservice/:cid*_:eid/*', '/en/dataservice/:cid*_:eid/*', '/sv/dataservice/:cid*_:eid/*']} exact render={(props)=><DataServicePage env={settings.env} {...props}/>} />
                
                {/* <Route path={['/concepts/:cid*_:eid/*', '/sv/concepts/:cid*_:eid/*', '/en/concepts/:cid*_:eid/*']} exact render={(props)=><ConceptPage env={settings.env} {...props}/>} /> */}
                <Route path={['/concepts/:scheme/:curi*', '/sv/concepts/:scheme/:curi*', '/en/concepts/:scheme/:curi*']} exact render={(props)=><ConceptPage env={settings.env} {...props}/>} />
                <Route path={['/externalconcepts/:scheme/:curi*', '/sv/externalconcepts/:scheme/:curi*', '/en/externalconcepts/:scheme/:curi*']} exact render={(props)=><ConceptPage env={settings.env} {...props}/>} />
                <Route path={['/externalterminology/:scheme/:curi*', '/sv/externalterminology/:scheme/:curi*', '/en/externalterminology/:scheme/:curi*']} exact render={(props)=><ConceptPage env={settings.env} {...props}/>} />
                <Route path={['/terminology/:scheme/:curi*', '/sv/terminology/:scheme/:curi*', '/en/terminology/:scheme/:curi*']} exact render={(props)=><ConceptPage env={settings.env} {...props}/>} />
                <Route path={['/specifications/:curi*', '/sv/specifications/:curi*', '/en/specifications/:curi*']} exact render={(props)=><SpecificationPage env={settings.env} {...props}/>} />                                
                {/* default */}
                <Route path={['/', '/sv','/en']} exact render={(props)=><StartPage env={settings.env} {...props}/>} />                

                {/* query graphql for connectedcontentpath */}
                <Route path={['/en/:path*']} exact render={(props) => (<ContentRouter env={settings.env} lang="en" {...props} />)} />                              
                <Route path={['/sv/:path*']} exact render={(props) => (<ContentRouter env={settings.env} lang="sv" {...props} />)} />                              
                <Route path={['/:path*']} exact render={(props) => (<ContentRouter env={settings.env} lang="sv" {...props} />)} />      
            </Switch>
          </App>
        )}
      </SettingsContext.Consumer>
    </ErrorBoundary>
  );
}
