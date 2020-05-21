import React from "react";

import { Artifact } from "../../ttf/artifact_pb";

import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  artifact: Artifact.AsObject;
};

export default function ArtifactInspector({
  artifact,
}: Props) {
  const itemsAreaStyle: React.CSSProperties = {
    maxHeight: "45vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  return (
    <>
      <ToolBoxTitle title={artifact.name} />
      <div style={itemsAreaStyle}>
        TODO
      </div>
    </>
  );
}
