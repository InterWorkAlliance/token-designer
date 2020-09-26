import React from "react";

import AnyArtifact from "./AnyArtifact";
import ArtifactIcon from "./ArtifactIcon";
import ArtifactType from "./ArtifactType";
import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  title: string;
  tools: (AnyArtifact | undefined)[];
  type: ArtifactType;
  artifactOnDragStart: (artifact?: [AnyArtifact, ArtifactType]) => void;
  setToolTip: (tooltip: AnyArtifact | null) => void;
};

export default function ToolBox({
  title,
  tools,
  type,
  artifactOnDragStart,
  setToolTip,
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
                setToolTip={setToolTip}
              />
            )
        )}
      </div>
    </>
  );
}
