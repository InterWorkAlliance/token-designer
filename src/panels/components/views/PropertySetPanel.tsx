import React, { useEffect, useState } from "react";

import { PropertySet } from "../../../ttf/core_pb";

import ArtifactInspector from "../inspectors/ArtifactInspector";
import { artifactPanelBaseEvents } from "../../artifactPanelBaseEvents";
import { propertySetPanelEvents } from "../../propertySetPanelEvents";
import { TaxonomyAsObjects } from "../../taxonomyAsObjects";
import ToolBoxTitle from "../ToolBoxTitle";

type Props = {
  editMode: boolean;
  postMessage: (message: any) => void;
};

export default function PropertySetPanel({ editMode, postMessage }: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyAsObjects | null>(null);
  const [artifact, setArtifact] = useState<PropertySet.AsObject | null>(null);

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
        <ToolBoxTitle
          title={artifact.artifact?.name || ""}
          onRename={
            editMode
              ? () => postMessage({ e: artifactPanelBaseEvents.Rename })
              : undefined
          }
        />
        <div style={{ margin: "var(--padding)", padding: "var(--padding)" }}>
          <ArtifactInspector
            editMode={editMode}
            taxonomy={taxonomy}
            artifact={artifact}
            artifactType="property-set"
          />
        </div>
      </>
    );
  } else {
    return <>Loading&hellip;</>;
  }
}
