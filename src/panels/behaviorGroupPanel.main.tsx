import React from 'react';
import ReactDOM from 'react-dom';

import BehaviorGroupPanel from './components/views/BehaviorGroupPanel';

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <BehaviorGroupPanel postMessage={vsCodePostMessage} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

window.onload = initialize;