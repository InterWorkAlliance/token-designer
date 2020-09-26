import React from "react";

import AnyArtifact from "./AnyArtifact";
import ArtifactIcon from "./ArtifactIcon";
import ArtifactType from "./ArtifactType";
import ToolBoxTitle from "./ToolBoxTitle";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  title: string;
  tools: (AnyArtifact | undefined)[];
  type: ArtifactType;
  artifactOnDragStart: (artifact?: [AnyArtifact, ArtifactType]) => void;
};

export default function ToolBox({
  title,
  tools,
  type,
  artifactOnDragStart,
}: Props) {
  const itemsAreaStyle: React.CSSProperties = {
    maxHeight: "45vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  return (
    <>
      <ToolBoxTitle title={title} />
      <div style={itemsAreaStyle}>
        {tools.map(
          (artifact) =>
            artifact && (
              <ArtifactIcon
                key={artifact.artifact?.name}
                artifact={artifact}
                artifactType={type}
                onDragStart={artifactOnDragStart}
              />
            )
        )}
      </div>
    </>
  );
}
