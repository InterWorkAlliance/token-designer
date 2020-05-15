import React, { useEffect, useState } from "react";

import FormulaDesigner from "./FormulaDesigner";

import { tokenDesignerEvents } from "../tokenDesignerEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function ({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState(null);
  const [formula, setFormula] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [incompatabilities, setIncompatabilities] = useState(null);

  const handleMessage = (message: any) => {
    if (message.taxonomy) {
      console.log("Received taxonomy update", message.taxonomy);
      setTaxonomy(message.taxonomy);
    }
    if (message.formula) {
      console.log("Received TokenFormula update", message.formula);
      setFormula(message.formula);
    }
    if (message.definition) {
      console.log("Received TokenDefinition update", message.definition);
      setDefinition(message.definition);
    }
    if (message.incompatabilities) {
      console.log(
        "Received incompatabilities update",
        message.incompatabilities
      );
      setIncompatabilities(message.incompatabilities);
    }
  };

  useEffect(() => {
    window.addEventListener("message", (msg) => handleMessage(msg.data));
    postMessage({ e: tokenDesignerEvents.Init });
  }, []);

  return <FormulaDesigner taxonomy={taxonomy} />;
}
