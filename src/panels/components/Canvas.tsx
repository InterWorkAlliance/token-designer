import React, { useState } from "react";

import ArtifactIcon from "./ArtifactIcon";

import { IArtifactAsObject } from "../../ttfInterface";

type Props = {
  tokenBase?: IArtifactAsObject;
  propertySets?: IArtifactAsObject[];
  behaviorGroups?: IArtifactAsObject[];
  behaviors?: IArtifactAsObject[];
  incompatabilities: any;
  selectedArtifact?: IArtifactAsObject;
  artifactBeingDraggedOn?: IArtifactAsObject;
  artifactOnDragStart?: (artifact?: IArtifactAsObject) => void;
  setSelectedArtifact?: (artifact?: IArtifactAsObject) => void;
  addArtifact?: (id: string) => void;
};

export default function Canvas({
  tokenBase,
  propertySets,
  behaviorGroups,
  behaviors,
  incompatabilities,
  selectedArtifact,
  artifactBeingDraggedOn,
  artifactOnDragStart,
  setSelectedArtifact,
  addArtifact,
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
    textAlign: "center",
  };
  const utlizedAreaStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    padding: "calc(5 * var(--padding))",
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
    if (addArtifact && artifactBeingDraggedOn?.artifactSymbol?.id) {
      addArtifact(artifactBeingDraggedOn.artifactSymbol?.id);
      if (setSelectedArtifact) {
        setSelectedArtifact(artifactBeingDraggedOn);
      }
    }
  };
  const errorText = (id?: string) => {
    if (id && incompatabilities[id]?.length) {
      return "Incompatible with " + incompatabilities[id].join(", ");
    }
  };
  return (
    <div
      style={style}
      onClick={() => setSelectedArtifact && setSelectedArtifact(undefined)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <span style={utlizedAreaStyle}>
        <span style={{ display: "inline-block" }}>
          <div style={{ whiteSpace: "nowrap" }}>
            <ArtifactIcon
              artifact={tokenBase}
              type={tokenBase ? "token-base" : "unknown"}
              selected={
                selectedArtifact?.artifactSymbol?.id ===
                tokenBase?.artifactSymbol?.id
              }
              onClick={setSelectedArtifact}
              onDragStart={artifactOnDragStart}
              error={errorText(tokenBase?.artifactSymbol?.id)}
            />
            {(propertySets || []).map((_) => (
              <ArtifactIcon
                key={_.artifactSymbol?.id}
                artifact={_}
                type="property-set"
                selected={
                  selectedArtifact?.artifactSymbol?.id === _.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifactSymbol?.id)}
              />
            ))}
          </div>
          <div style={{ width: "var(--iconWidth)" }}>
            {(behaviorGroups || []).map((_) => (
              <ArtifactIcon
                key={_.artifactSymbol?.id}
                artifact={_}
                type="behavior-group"
                selected={
                  selectedArtifact?.artifactSymbol?.id === _.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifactSymbol?.id)}
              />
            ))}
            {(behaviors || []).map((_) => (
              <ArtifactIcon
                key={_.artifactSymbol?.id}
                artifact={_}
                type="behavior"
                selected={
                  selectedArtifact?.artifactSymbol?.id === _.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifactSymbol?.id)}
              />
            ))}
          </div>
        </span>
      </span>
    </div>
  );
}
