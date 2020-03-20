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
};

export const PageMetadata: React.SFC<PageMetadataProps> = props => {
  const { seoTitle, seoDescription, robotsFollow, robotsIndex, lang } = props;

  const robots = [
    robotsFollow ? 'follow' : 'nofollow',
    robotsIndex ? 'index' : 'noindex',
  ];

  return (
    <Helmet htmlAttributes={{ lang }} title={seoTitle || ''}>
      {seoTitle && <title>{seoTitle}</title>}
      {seoDescription && (
        <meta name="description" content={seoDescription} />
      )}
      <meta name="robots" content={robots.join(',')} />        
    </Helmet>
  );
};
