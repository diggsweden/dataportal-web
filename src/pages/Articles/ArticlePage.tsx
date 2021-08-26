import React from 'react';
import 'url-search-params-polyfill';
import { ArticleItem } from '../../components/Articles'
import { PageProps } from '../PageProps'

export const ArticlePage: React.FC<PageProps> = ({ env, match }) =>
  <ArticleItem env={env} id={match.params.nid} />
