import React, {Component} from 'react';
import {cautionAction, goAction, stopAction} from './actions';

export class Buttons extends Component {
  componentWillMount() {
    this.props.store.subscribe(() => {
      this.forceUpdate();
    });
  }
  
  render() {
    const state = this.props.store.getState();
    
    return (
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => {
          this.props.store.dispatch(goAction)
        }}
                disabled={state === 'GO' || state === 'CAUTION'}
                style={{ cursor: 'pointer' }}>
          Go
        </button>
        
        <button onClick={() => {
          this.props.store.dispatch(cautionAction)
        }}
                disabled={state === 'CAUTION' || state === 'STOP'}
                style={{ cursor: 'pointer' }}>
          Caution
        </button>
        
        <button onClick={() => {
          this.props.store.dispatch(stopAction)
        }}
                disabled={state === 'STOP' || state === 'GO'}
                style={{ cursor: 'pointer' }}>
          Stop
        </button>
      </div>
    )
  }
}
