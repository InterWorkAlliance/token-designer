import React from 'react';
import ReactDOM from 'react-dom';

import PropertySetPanel from './components/PropertySetPanel';

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <PropertySetPanel postMessage={vsCodePostMessage} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

window.onload = initialize;