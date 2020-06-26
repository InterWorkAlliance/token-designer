import React, { useEffect, useState } from "react";

import { taxonomy } from "../../../ttf/protobufs";

import ArtifactInspector from "../inspectors/ArtifactInspector";
import ToolBoxTitle from "../ToolBoxTitle";

import { tokenBasePanelEvents } from "../../tokenBasePanelEvents";

type Props = {
  postMessage: (message: any) => void;
};

export default function TokenBasePanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<taxonomy.model.ITaxonomy | null>(
    null
  );
  const [artifact, setArtifact] = useState<taxonomy.model.core.IBase | null>(
    null
  );

  const handleMessage = (message: any) => {
    if (message.taxonomy) {
      console.log("Received taxonomy update", message.taxonomy);
      setTaxonomy(message.taxonomy);
    }
    if (message.artifact) {
      console.log("Received artifact update", message.artifact);
      setArtifact(message.artifact);
    }
  };

  useEffect(() => {
    window.addEventListener("message", (msg) => handleMessage(msg.data));
    postMessage({ e: tokenBasePanelEvents.Init });
  }, []);

  if (artifact && taxonomy) {
    return (
      <>
        <ToolBoxTitle title={artifact.artifact?.name || ""} />
        <div style={{ margin: "var(--padding)", padding: "var(--padding)" }}>
          <ArtifactInspector
            taxonomy={taxonomy}
            artifact={artifact}
            artifactType="token-base"
          />
        </div>
      </>
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
