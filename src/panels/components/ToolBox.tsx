import React from "react";

import { Artifact } from "../../ttf/artifact_pb";

import ArtifactIcon from "./ArtifactIcon";
import ArtifactType from "./ArtifactType";
import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  title: string;
  tools: (Artifact.AsObject | undefined)[];
  type: ArtifactType;
  artifactOnDragStart: (artifact?: Artifact.AsObject) => void;
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
                key={artifact.name}
                artifact={artifact}
                type={type}
                onDragStart={artifactOnDragStart}
              />
            )
        )}
      </div>
    </>
  );
}
