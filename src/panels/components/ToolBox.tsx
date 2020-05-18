import React from "react";

import { Base, PropertySet, Behavior, BehaviorGroup } from "../../ttf/core_pb";
import { Artifact } from "../../ttf/artifact_pb";

import ArtifactIcon from "./ArtifactIcon";
import ArtifactType from "./ArtifactType";
import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  title: string;
  tools: (
    | Base.AsObject
    | PropertySet.AsObject
    | Behavior.AsObject
    | BehaviorGroup.AsObject
  )[];
  type: ArtifactType;
};

export default function ToolBox({ title, tools, type }: Props) {
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
        {tools
          .filter((_) => !!_.artifact)
          .map((_) => _.artifact as Artifact.AsObject)
          .map((artifact: Artifact.AsObject) => (
            <ArtifactIcon title={artifact.name} type={type} />
          ))}
      </div>
    </>
  );
}
