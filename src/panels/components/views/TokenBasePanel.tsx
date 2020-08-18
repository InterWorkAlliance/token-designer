import React, { useEffect, useState } from "react";

import { Base } from "../../../ttf/core_pb";

import ArtifactInspector from "../inspectors/ArtifactInspector";
import { artifactPanelBaseEvents } from "../../artifactPanelBaseEvents";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import { tokenBasePanelEvents } from "../../tokenBasePanelEvents";
import ToolBoxTitle from "../ToolBoxTitle";

type Props = {
  postMessage: (message: any) => void;
};

export default function TokenBasePanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyAsObjects | null>(null);
  const [artifact, setArtifact] = useState<Base.AsObject | null>(null);

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
    postMessage({ e: artifactPanelBaseEvents.Init });
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
