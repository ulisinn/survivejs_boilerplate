import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {reducer} from './reducer';
import {App} from './app';
import {Provider} from 'react-redux';


const app = document.createElement('div');
document.body.appendChild(app);

console.log('test', app.id);


ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <App />
  </Provider>,
  app);
 
