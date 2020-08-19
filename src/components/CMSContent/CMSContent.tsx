import React from 'react'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const NEWS = gql `
  {
    news{
      id
      name   
      body 
    }
  }
`;

export const CMSContent : React.FC = () => {

  const { loading, error, data } = useQuery<{news:Array<any>}>(NEWS);

  return (
    <div>      
      {loading && (<p>Laddar..</p>)}
      {!loading && error && (<p>Fel!</p>)}
      <ul>
      {!loading && data && data.news.length > 0 &&
        data.news.map((n,index) => {
          return (
          <li key={index}>            
            {n.name}
            <p dangerouslySetInnerHTML={{__html:n.body}}></p>
          </li>)
        })                
      }
      </ul>
    </div>
  )
}