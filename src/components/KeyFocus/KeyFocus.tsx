import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

//Removes class "no-focus-outline" for keyboard navigation..

export interface keyFocusProps extends RouteComponentProps<any>{} 

class keyFocusComponent extends React.PureComponent<keyFocusProps> {

    componentDidMount(){
        document.body.addEventListener('keyup', function(e) {          
            if(e.which === 9){              
                document.documentElement.classList.remove(
                'no-focus-outline'
                );
            }
        });

        document.body.addEventListener('click', function(e) {                             
          document.documentElement.classList.add('no-focus-outline')
        });          
    }

    render(){
      return <></>
    }
}

export const KeyFocus = withRouter(keyFocusComponent);
