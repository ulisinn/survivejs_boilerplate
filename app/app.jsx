import React, { Component } from 'react';
import { Stoplight } from './stoplight';
import { Buttons } from './buttons';

export class App extends Component {
  render() {
    return(
      <div>
        <Stoplight store={this.props.store} />
        <Buttons   store={this.props.store} />
      </div>
    )
  }
}
