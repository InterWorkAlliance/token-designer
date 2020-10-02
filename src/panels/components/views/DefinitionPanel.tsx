import React, { useEffect, useState } from "react";

import { TemplateDefinition } from "../../../ttf/core_pb";

import DefinitionDesigner from "../DefinitionDesigner";

import { definitionPanelEvents } from "../../definitionPanelEvents";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";

type Props = {
  postMessage: (message: any) => void;
};

export default function DefinitionPanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyAsObjects | null>(null);
  const [
    definition,
    setDefinition,
  ] = useState<TemplateDefinition.AsObject | null>(null);

  const handleMessage = (message: any) => {
    if (message.taxonomy) {
      console.log("Received taxonomy update", message.taxonomy);
      setTaxonomy(message.taxonomy);
    }
    if (message.definition) {
      console.log("Received TokenDefinition update", message.definition);
      setDefinition(message.definition);
    }
  };

  useEffect(() => {
    window.addEventListener("message", (msg) => handleMessage(msg.data));
    postMessage({ e: definitionPanelEvents.Init });
  }, []);

  const setDefinitionName = (name: string) => {
    postMessage({ e: definitionPanelEvents.SetDefinitionName, name });
  };

  const setDefinitionProperty = (path: string, name: string) => {
    postMessage({ e: definitionPanelEvents.SetProperty, path, name });
  };

  const loadFormula = (tooling: string) => {
    postMessage({ e: definitionPanelEvents.LoadFormula, t: tooling });
  };

  if (taxonomy && definition) {
    return (
      <DefinitionDesigner
        taxonomy={taxonomy}
        definition={definition}
        setDefinitionName={setDefinitionName}
        setDefinitionProperty={setDefinitionProperty}
        loadFormula={loadFormula}
      />
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
