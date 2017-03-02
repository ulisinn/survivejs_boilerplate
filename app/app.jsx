import React, { Component } from 'react';
import { StoplightContainer } from './stoplight-container';
import { ButtonContainer } from './button-container';
import { createStore } from 'redux';
import { reducer } from './reducer';

export class App extends Component {
  render() {
    const store = createStore(reducer);
    
    return(
      <div>
        <StoplightContainer store={store}/>
        <ButtonContainer store={store}/>
      </div>
    )
  }
}
