import React from "react";
import ReactDOM from "react-dom";

import FormulaPanel from "./components/views/FormulaPanel";
import PanelWatchdog from "./components/PanelWatchdog";

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <PanelWatchdog postMessage={vsCodePostMessage}>
        <FormulaPanel postMessage={vsCodePostMessage} />
      </PanelWatchdog>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

window.onload = initialize;
