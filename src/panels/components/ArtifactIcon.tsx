import React from "react";

import AnyArtifact from "./AnyArtifact";
import ArtifactType from "./ArtifactType";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects | null;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
  error?: string;
  selected?: boolean;
  onClick?: (artifact?: [AnyArtifact, ArtifactType]) => void;
  onDragStart?: (artifact?: [AnyArtifact, ArtifactType]) => void;
};

export default function ArtifactIcon({
  taxonomy,
  artifact,
  artifactType,
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
  switch (artifactType) {
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
  const title = artifact?.artifact?.name || "Unknown";
  let tooltip = title;
  if (error) {
    tooltip += ` - ${error}`;
  }
  const dispatchOnDragStart = onDragStart
    ? () => onDragStart(artifact && artifactType ? [artifact, artifactType] : undefined)
    : undefined;
  const dispatchOnClick = onClick
    ? (ev: React.MouseEvent) => {
        onClick(artifact && artifactType ? [artifact, artifactType] : undefined);
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
      <span style={{ position: "relative" }}>
        <img src={imgSrc} style={imgStyle} draggable={false} />
        {error && (
          <span
            style={{
              position: "absolute",
              bottom: 5,
              right: 5,
              fontSize: "1.75em",
              textShadow: "1px 1px",
            }}
          >
            ❗
          </span>
        )}
      </span>
      <div style={titleStyle}>{title}</div>
    </span>
  );
}
