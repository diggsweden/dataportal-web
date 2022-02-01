import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

//Only shows css-focus on input element on keyboard navigation.
//Removes css-focus on mouse click.

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
