import React, { useState } from "react";

import { Artifact } from "../../ttf/artifact_pb";

import ArtifactIcon from "./ArtifactIcon";

type Props = {
  tokenBase?: Artifact.AsObject;
  propertySets?: Artifact.AsObject[];
  behaviorGroups?: Artifact.AsObject[];
  behaviors?: Artifact.AsObject[];
  artifactBeingDraggedOn?: Artifact.AsObject;
  artifactOnDragStart?: (artifact: Artifact.AsObject) => void;
};

export default function Canvas({
  tokenBase,
  propertySets,
  behaviorGroups,
  behaviors,
  artifactBeingDraggedOn,
  artifactOnDragStart,
}: Props) {
  const [dropTargetActive, setDropTargetActive] = useState(false);
  const style: React.CSSProperties = {
    border: "var(--borderWidth) solid var(--vscode-panel-border)",
    color: "var(--vscode-editor-foreground)",
    backgroundColor: dropTargetActive
      ? "var(--vscode-panel-dropBackground)"
      : "var(--vscode-editor-background)",
    position: "absolute",
    top: "var(--padding)",
    bottom: "var(--padding)",
    left: "var(--padding)",
    right: "var(--padding)",
    overflow: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const utlizedAreaStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: "10vh",
    marginBottom: "10vh",
    marginLeft: "10vw",
    marginRight: "10vw",
  };
  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    setDropTargetActive(!!artifactBeingDraggedOn);
  };
  const onDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
    setDropTargetActive(false);
  };
  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    setDropTargetActive(false);
    // TODO...
  };
  return (
    <div
      style={style}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <span style={utlizedAreaStyle}>
        <div>
          <ArtifactIcon
            artifact={tokenBase}
            type={tokenBase ? "token-base" : "unknown"}
            onDragStart={artifactOnDragStart}
          />
          {(propertySets || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="property-set"
              onDragStart={artifactOnDragStart}
            />
          ))}
        </div>
        <div style={{ width: "var(--iconWidth)" }}>
          {(behaviorGroups || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="behavior-group"
              onDragStart={artifactOnDragStart}
            />
          ))}
          {(behaviors || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="behavior"
              onDragStart={artifactOnDragStart}
            />
          ))}
        </div>
      </span>
    </div>
  );
}
