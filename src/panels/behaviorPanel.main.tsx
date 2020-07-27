import React from "react";
import ReactDOM from "react-dom";

import BehaviorPanel from "./components/views/BehaviorPanel";
import PanelWatchdog from "./components/PanelWatchdog";

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <PanelWatchdog postMessage={vsCodePostMessage}>
        <BehaviorPanel editMode={true} postMessage={vsCodePostMessage} />
      </PanelWatchdog>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

window.onload = initialize;
