import React from "react";

import { Artifact } from "../../ttf/artifact_pb";

import ArtifactType from "./ArtifactType";

type Props = {
  artifact?: Artifact.AsObject;
  type: ArtifactType | "unknown";
  error?: string;
  onDragStart?: (artifact: Artifact.AsObject) => void;
};

export default function ArtifactIcon({
  artifact,
  type,
  error,
  onDragStart,
}: Props) {
  const style: React.CSSProperties = {
    cursor: "pointer",
    display: "inline-block",
    width: "var(--iconWidth)",
    textAlign: "center",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
  };
  const imgStyle: React.CSSProperties = {
    width: "3.5em",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
    filter: error ? "grayscale(100%)" : undefined,
  };
  const titleStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
    color: error ? "var(--vscode-errorForeground)" : undefined,
    fontWeight: error ? "bold" : undefined,
  };
  let imgSrc = "token-designer/unknown.svg";
  switch (type) {
    case "token-base":
      imgSrc = "token-designer/token-base.svg";
      break;
    case "property-set":
      imgSrc = "token-designer/property-set.svg";
      break;
    case "behavior":
      imgSrc = "token-designer/behavior.svg";
      break;
    case "behavior-group":
      imgSrc = "token-designer/behavior-group.svg";
      break;
  }
  let title = artifact?.name || "Unknown";
  if (error) {
    title += ` - ${error}`;
  }
  const dispatchOnDragStart =
    artifact && onDragStart ? () => onDragStart(artifact) : undefined;
  return (
    <span
      style={style}
      title={title}
      draggable={!!onDragStart}
      onDragStart={dispatchOnDragStart}
    >
      <img src={imgSrc} style={imgStyle} draggable={false} />
      <div style={titleStyle}>{title}</div>
    </span>
  );
}
