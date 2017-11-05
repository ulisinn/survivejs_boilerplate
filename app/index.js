import './styles/main.scss';
import 'purecss';
import * as React from 'react';
import { render } from 'react-dom';
import Home from './component';

const rootElement = document.createElement('div');
rootElement.className = 'root';
const container = document.createElement('div');
container.className = 'container';
rootElement.appendChild(container);
document.body.appendChild(rootElement);


render(<Home text={'hi!!!'}/>,
  container,
);
