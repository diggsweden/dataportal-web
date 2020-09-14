import React from 'react';
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
};

export const PageMetadata: React.SFC<PageMetadataProps> = props => {
  const { seoTitle, seoDescription, robotsFollow, robotsIndex, lang, canonicalUrl } = props;

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
    </Helmet>
  );
};
