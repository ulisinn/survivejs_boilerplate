import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';

import {reducer} from './reducer';
import {App} from './app';

const app = document.createElement('div');
document.body.appendChild(app);

// const store = createStore(reducer);


/*
 ReactDOM.render(<App store={store}/>,
 app);
 */


ReactDOM.render(<App store={createStore(reducer)}/>,
  app);
