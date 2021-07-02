import { Box, Accordion } from '@digg/design-system';
import React from 'react';
import 'url-search-params-polyfill';
import { __RouterContext } from 'react-router';
import { PageProps } from '../PageProps'
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/client';
import { LoadingPage } from 'pages/LoadingPage';
import { ContentPage } from './ContentPage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { StaticBreadcrumb, StaticPath } from '../../components/Breadcrumb';

interface ContentPageProps extends PageProps{
  lang:string;
}

const contentQuery = gql`
  query content($siteurl: String!, $path: String, $lang: String, $paths: [String]) {
    contents:
      contents(siteurl:$siteurl, connectedtagpaths:[$path], lang:$lang)
      {
        id      
        name
        published      
        ... on Page {        
          preambleHTML        
          bodyHTML        
        }
        ... on News {        
          preambleHTML        
          bodyHTML
        }
        ... on Project {        
          preambleHTML        
          bodyHTML
        }
      }
    breadcrumb:
      tags(siteurl:$siteurl,connectedtagpathsor:$paths, lang: $lang)
      {      
        connectedTagPath			
        title
      }
  }
`;

/**
 * Router component for dynamic content, via federated graphql content backend
 * @param props 
 */
export const ContentRouter: React.FC<ContentPageProps> = (props) => {  
    
  //caclulate breadcrumbs path, we need to query backend to retreive correct titles
  let pathsplitted :string[] = props.match.params.path ? props.match.params.path.split('/') : [];
  pathsplitted = pathsplitted.filter(function (x) { return x != ""; });
  var copy = [...pathsplitted];
  let paths: string[] = []
  let staticPaths: StaticPath[] = [];

  pathsplitted.forEach(element => {      
    paths.push(`/${copy.join('/')}/`)
    copy.pop();
  });     

  const {loading, error, data } = 
    useQuery<{ contents: Array<any>, breadcrumb: Array<any> }>(contentQuery,{      
      variables:{        
        path:`/${props.match.params.path}/`,
        paths:paths,
        lang: props.lang ?? "sv",
        siteurl: props.env.CONTENTBACKEND_SITEURL
      }
    }); 
  
    if(!loading && data && data?.breadcrumb && data?.breadcrumb.length > 0)
    {
      //create staticpath for breadcrumbs component
      data.breadcrumb
        .forEach((n:any) => {
          staticPaths.push({
            path: `/${(props.lang ?? "sv")}${n.connectedTagPath}`,
            title: n.title
          });
        });

        //sort path according to number of /
        staticPaths.sort((a,b) => {
          let aNum = (a.path.match(/\//g) || []).length;
          let bNum = (b.path.match(/\//g) || []).length;
  
          if(aNum > bNum) return 1;
          if(aNum < bNum) return -1;
          return 0;
        })
    }

    if(loading)
      return <LoadingPage  />
    //content found with id, switch type for corrent Content component
    else if(!loading && data && data.contents && data.contents.length > 0)
    {      
      return <ContentPage staticPaths={staticPaths} {...props} content={data!.contents[0]} />
    }
    else    
      return <NotFoundPage {...props} />
}
