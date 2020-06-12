import React, { useState } from "react";

import { Base, PropertySet, BehaviorGroup, Behavior } from "../../ttf/core_pb";

import AnyArtifact from "./AnyArtifact";
import ArtifactIcon from "./ArtifactIcon";
import ArtifactType from "./ArtifactType";

type Props = {
  tokenBase?: Base.AsObject;
  propertySets?: PropertySet.AsObject[];
  behaviorGroups?: BehaviorGroup.AsObject[];
  behaviors?: Behavior.AsObject[];
  incompatabilities?: any;
  selectedArtifact?: [AnyArtifact, ArtifactType];
  artifactBeingDraggedOn?: [AnyArtifact, ArtifactType];
  artifactOnDragStart?: (artifact?: [AnyArtifact, ArtifactType]) => void;
  setSelectedArtifact?: (artifact?: [AnyArtifact, ArtifactType]) => void;
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
    if (
      addArtifact &&
      artifactBeingDraggedOn &&
      artifactBeingDraggedOn[0]?.artifact?.artifactSymbol?.id
    ) {
      addArtifact(artifactBeingDraggedOn[0]?.artifact?.artifactSymbol?.id);
      if (setSelectedArtifact) {
        setSelectedArtifact(artifactBeingDraggedOn);
      }
    }
  };
  const errorText = (id?: string) => {
    if (incompatabilities && id && incompatabilities[id]?.length) {
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
              type={tokenBase ? "token-base" : undefined}
              selected={
                selectedArtifact &&
                selectedArtifact[0].artifact?.artifactSymbol?.id ===
                  tokenBase?.artifact?.artifactSymbol?.id
              }
              onClick={setSelectedArtifact}
              onDragStart={artifactOnDragStart}
              error={errorText(tokenBase?.artifact?.artifactSymbol?.id)}
            />
            {(propertySets || []).map((_) => (
              <ArtifactIcon
                key={_.artifact?.artifactSymbol?.id}
                artifact={_}
                type="property-set"
                selected={
                  selectedArtifact &&
                  selectedArtifact[0].artifact?.artifactSymbol?.id ===
                    _.artifact?.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifact?.artifactSymbol?.id)}
              />
            ))}
          </div>
          <div style={{ width: "var(--iconWidth)" }}>
            {(behaviorGroups || []).map((_) => (
              <ArtifactIcon
                key={_.artifact?.artifactSymbol?.id}
                artifact={_}
                type="behavior-group"
                selected={
                  selectedArtifact &&
                  selectedArtifact[0].artifact?.artifactSymbol?.id ===
                    _.artifact?.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifact?.artifactSymbol?.id)}
              />
            ))}
            {(behaviors || []).map((_) => (
              <ArtifactIcon
                key={_.artifact?.artifactSymbol?.id}
                artifact={_}
                type="behavior"
                selected={
                  selectedArtifact &&
                  selectedArtifact[0].artifact?.artifactSymbol?.id ===
                    _.artifact?.artifactSymbol?.id
                }
                onClick={setSelectedArtifact}
                onDragStart={artifactOnDragStart}
                error={errorText(_.artifact?.artifactSymbol?.id)}
              />
            ))}
          </div>
        </span>
      </span>
    </div>
  );
}
