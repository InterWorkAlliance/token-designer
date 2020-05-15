import React, { useEffect } from "react";

import FormulaDesigner from "./FormulaDesigner";

import { tokenDesignerEvents } from "../tokenDesignerEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function ({ postMessage }: Props) {
  const handleMessage = (message: any) => {
    if (message.taxonomy) {
      console.log('Received taxonomy update', message.taxonomy);
    }
    if (message.formula) {
      console.log('Received TokenFormula update', message.formula);
    }
    if (message.definition) {
      console.log('Received TokenDefinition update', message.definition);
    }
    if (message.incompatabilities) {
      console.log(
        'Received incompatabilities update',
        message.incompatabilities
      );
    }
  };

  useEffect(() => {
    window.addEventListener("message", (msg) => handleMessage(msg.data));
    postMessage({ e: tokenDesignerEvents.Init });
  }, []);

  return <FormulaDesigner />;
}
