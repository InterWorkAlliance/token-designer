import React, { useEffect, useState } from "react";

import { TemplateFormula } from "../../ttf/core_pb";

import FormulaDesigner from "./FormulaDesigner";

import { tokenDesignerEvents } from "../tokenDesignerEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function App({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState(null);
  const [formula, setFormula] = useState<TemplateFormula.AsObject | null>(null);
  const [definition, setDefinition] = useState(null);
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

  const addArtifact = (id: string) => {
    postMessage({ e: tokenDesignerEvents.Add, id });
  };

  const removeArtifact = (id: string) => {
    postMessage({ e: tokenDesignerEvents.Remove, id });
  };

  const setDefinitionName = (name: string) => {
    postMessage({ e: tokenDesignerEvents.SetDefinitionName, name });
  };

  const setDefinitionProperty = (
    artifactId: string,
    propertyName: string,
    value: string
  ) => {
    postMessage({
      e: tokenDesignerEvents.SetDefinitionProperty,
      artifactId,
      propertyName,
      value,
    });
  };

  const setFormulaDescription = (description: string) => {
    postMessage({ e: tokenDesignerEvents.SetFormulaDescription, description });
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
  } else if (definition) {
    return <>TODO: Token definition editor</>;
  } else {
    return <>Loading&hellip;</>;
  }
}
