import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

export type PageMetadataProps = { 
  lang: string 
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoImageUrl: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  canonicalUrl?: string | null;
  socialMeta? : SocialMetaTags | null;
};

export interface SocialMetaTagsProps {
  socialMetaTags: SocialMetaTags 
}

export interface SocialMetaTags {
  socialTitle?:string | null;
  socialDescription?:string | null;
  socialImageUrl?:string | null;
  socialUrl?:string | null;
  SocialType?: string | "website";
}


export const PageMetadata: React.FC<PageMetadataProps> = props => {
  const { seoTitle, seoDescription, robotsFollow, robotsIndex, lang, canonicalUrl, socialMeta } = props;

  const robots = [
    robotsFollow ? 'follow' : 'nofollow',
    robotsIndex ? 'index' : 'noindex',
  ];

  return (
    <Helmet htmlAttributes={{ lang }} title={seoTitle || 'Sveriges dataportal'}>
      {seoTitle && <title>{seoTitle}</title>}                 
      {seoDescription && (
        <meta name="description" content={seoDescription} />
      )}
      <meta name="robots" content={robots.join(',')} />        
      {(canonicalUrl && canonicalUrl.length > 0) && (
        <link rel="canonical" href={canonicalUrl} />
      )}
      {socialMeta && (         
        <meta property="og:type" content={socialMeta.SocialType || 'website'} />       
      )} 
      {socialMeta && (      
        <meta name="twitter:card" content="summary" />
      )}
      {socialMeta && (    
        <meta name="twitter:site" content="@oppnadata_psi" />
      )}        
      {socialMeta && socialMeta.socialTitle && (
        <meta property="og:title" content={socialMeta.socialTitle || ''} />
      )} 
      {socialMeta && socialMeta.socialDescription && (
        <meta property="og:description" content={socialMeta.socialDescription || ''} />
      )}    
      {socialMeta && socialMeta.socialUrl && (
        <meta property="og:url" content={socialMeta.socialUrl || ''} />
      )}    
      {socialMeta && socialMeta.socialImageUrl && (
        <meta property="og:image" content={socialMeta.socialImageUrl || ''} />
      )}                         
    </Helmet>
  );
};