import React from 'react';
import ReactDOM from 'react-dom';

import TokenBasePanel from './components/TokenBasePanel';

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <TokenBasePanel postMessage={vsCodePostMessage} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

window.onload = initialize;