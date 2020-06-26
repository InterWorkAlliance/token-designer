import React, { useEffect, useState } from "react";

import { taxonomy } from "../../../ttf/protobufs";

import DefinitionDesigner from "../DefinitionDesigner";

import { definitionPanelEvents } from "../../definitionPanelEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function DefinitionPanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<taxonomy.model.ITaxonomy | null>(null);
  const [
    definition,
    setDefinition,
  ] = useState<taxonomy.model.core.ITemplateDefinition | null>(null);

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

  if (taxonomy && definition) {
    return (
      <DefinitionDesigner
        taxonomy={taxonomy}
        definition={definition}
        setDefinitionName={setDefinitionName}
      />
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
