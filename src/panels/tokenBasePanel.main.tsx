import React from "react";
import ReactDOM from "react-dom";

import PanelWatchdog from "./components/PanelWatchdog";
import TokenBasePanel from "./components/views/TokenBasePanel";

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <PanelWatchdog postMessage={vsCodePostMessage}>
        <TokenBasePanel postMessage={vsCodePostMessage} />
      </PanelWatchdog>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

window.onload = initialize;
