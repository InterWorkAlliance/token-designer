import React, { useEffect, useState } from "react";

import { Behavior } from "../../ttf/core_pb";

import ArtifactInspector from "./ArtifactInspector";

import { behaviorPanelEvents } from "../behaviorPanelEvents";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";
import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  postMessage: (message: any) => void;
};

export default function BehaviorPanel({ postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyAsObjects | null>(null);
  const [artifact, setArtifact] = useState<Behavior.AsObject | null>(null);

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
    postMessage({ e: behaviorPanelEvents.Init });
  }, []);

  if (artifact && taxonomy) {
    const previewWidth = "40vw";
    return (
      <>
        <CanvasPane
          formula={artifact.artifact?.name}
          left="0"
          right={previewWidth}
        >
          <div
            style={{
              height: "100%",
              overflowY: "scroll",
              padding: "var(--padding)",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(artifact, undefined, 4)}
          </div>
        </CanvasPane>
        <ToolPane position="right" width={previewWidth}>
          <ToolBoxTitle title={artifact.artifact?.name || ""} />
          <div style={{ margin: "var(--padding)", padding: "var(--padding)" }}>
            <ArtifactInspector
              taxonomy={taxonomy}
              artifact={artifact.artifact}
            />
          </div>
        </ToolPane>
      </>
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
