import React, { useEffect, useState } from "react";

import { TemplateFormula } from "../../ttf/core_pb";

import FormulaDesigner from "./FormulaDesigner";

import { formulaPanelEvents } from "../formulaPanelEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function FormulaPanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState(null);
  const [formula, setFormula] = useState<TemplateFormula.AsObject | null>(null);
  const [incompatabilities, setIncompatabilities] = useState<any>({});

  const handleMessage = (message: any) => {
    if (message.taxonomy) {
      console.log("Received taxonomy update", message.taxonomy);
      setTaxonomy(message.taxonomy);
    }
    if (message.formula) {
      console.log("Received TokenFormula update", message.formula);
      setFormula(message.formula);
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
    postMessage({ e: formulaPanelEvents.Init });
  }, []);

  const addArtifact = (id: string) => {
    postMessage({ e: formulaPanelEvents.Add, id });
  };

  const removeArtifact = (id: string) => {
    postMessage({ e: formulaPanelEvents.Remove, id });
  };

  const setFormulaDescription = (description: string) => {
    postMessage({ e: formulaPanelEvents.SetFormulaDescription, description });
  };

  if (formula) {
    return (
      <FormulaDesigner
        taxonomy={taxonomy}
        formula={formula}
        incompatabilities={incompatabilities}
        addArtifact={addArtifact}
        removeArtifact={removeArtifact}
        setFormulaDescription={setFormulaDescription}
      />
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
