import React, {Component} from 'react';

export const Buttons = ({
                          go,
                          caution,
                          stop,
                          lightStatus
                        }) => {
  return(
    <div style={{textAlign: 'center'}}>
      <button onClick={go}
              disabled={lightStatus === 'GO' || lightStatus === 'CAUTION'}
              style={{cursor: 'pointer'}}>
        Go
      </button>
      
      <button onClick={caution}
              disabled={lightStatus === 'CAUTION' || lightStatus === 'STOP'}
              style={{cursor: 'pointer'}}>
        Caution
      </button>
      
      <button onClick={stop}
              disabled={lightStatus === 'STOP' || lightStatus === 'GO'}
              style={{cursor: 'pointer'}}>
        Stop
      </button>
    </div>
  )
};
