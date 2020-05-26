import React from "react";

import ArtifactType from "./ArtifactType";

import { IArtifactAsObject } from "../../ttfInterface";

type Props = {
  artifact?: IArtifactAsObject;
  type: ArtifactType | "unknown";
  error?: string;
  selected?: boolean;
  onClick?: (artifact?: IArtifactAsObject) => void;
  onDragStart?: (artifact?: IArtifactAsObject) => void;
};

export default function ArtifactIcon({
  artifact,
  type,
  error,
  selected,
  onClick,
  onDragStart,
}: Props) {
  const style: React.CSSProperties = {
    cursor: "pointer",
    display: "inline-block",
    width: "var(--iconWidth)",
    textAlign: "center",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
    zIndex: selected ? 2 : 1,
    maxHeight: "var(--iconWidth)",
    height: "var(--iconWidth)",
  };
  const imgStyle: React.CSSProperties = {
    width: "3.5em",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
    filter: error ? "grayscale(100%)" : undefined,
    border: selected
      ? "var(--borderWidth) solid var(--vscode-editor-selectionBackground)"
      : undefined,
  };
  const titleStyle: React.CSSProperties = {
    whiteSpace: selected ? "break-spaces" : "nowrap",
    wordBreak: selected ? "break-word" : undefined,
    overflow: selected ? "visible" : "hidden",
    textOverflow: selected ? "" : "ellipsis",
    margin: "var(--paddingSmall)",
    padding: "var(--paddingSmall)",
    color: error
      ? "var(--vscode-errorForeground)"
      : selected
      ? "var(--vscode-editor-selectionForeground)"
      : undefined,
    backgroundColor: selected
      ? "var(--vscode-editor-selectionBackground)"
      : undefined,
    fontWeight: error || selected ? "bold" : undefined,
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
  const title = artifact?.name || "Unknown";
  let tooltip = title;
  if (error) {
    tooltip += ` - ${error}`;
  }
  const dispatchOnDragStart = onDragStart
    ? () => onDragStart(artifact)
    : undefined;
  const dispatchOnClick = onClick
    ? (ev: React.MouseEvent) => {
        onClick(artifact);
        ev.stopPropagation();
      }
    : undefined;
  return (
    <span
      style={style}
      title={tooltip}
      draggable={!!onDragStart}
      onClick={dispatchOnClick}
      onDragStart={dispatchOnDragStart}
    >
      <img src={imgSrc} style={imgStyle} draggable={false} />
      <div style={titleStyle}>{title}</div>
    </span>
  );
}
