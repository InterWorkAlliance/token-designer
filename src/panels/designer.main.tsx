import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <App postMessage={vsCodePostMessage} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

window.onload = initialize;