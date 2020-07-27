import React from "react";
import ReactDOM from "react-dom";

import PanelWatchdog from "./components/PanelWatchdog";
import PropertySetPanel from "./components/views/PropertySetPanel";

declare var acquireVsCodeApi: any;

function initialize() {
  const vsCodePostMessage = acquireVsCodeApi().postMessage;
  ReactDOM.render(
    <React.StrictMode>
      <PanelWatchdog postMessage={vsCodePostMessage}>
        <PropertySetPanel editMode={true} postMessage={vsCodePostMessage} />
      </PanelWatchdog>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

window.onload = initialize;
