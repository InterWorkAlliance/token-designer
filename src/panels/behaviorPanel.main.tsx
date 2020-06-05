import React from 'react';
import ReactDOM from 'react-dom';

import BehaviorPanel from './components/BehaviorPanel';

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <BehaviorPanel postMessage={vsCodePostMessage} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

window.onload = initialize;