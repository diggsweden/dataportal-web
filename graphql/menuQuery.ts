import { gql } from '@apollo/client';

export const MENU_QUERY = gql`
  query MainMenu($locale: String) {
    dataportal_Digg_Menu(locale: $locale) {
      title
      uiHints
      locale
      children {
        ...MenuData
        children {
          ...MenuData
          children {
            ...MenuData
          }
        }
      }
    }
  }

  fragment MenuData on dataportal_Digg_IMenu {
    link {
      title
      link
      linktype
      description
    }
    order
  }
`;
