import React, { useState } from "react";

import { IArtifactAsObject } from "../../ttfInterface";

type Props = {
  position: "left" | "right";
  width: string;
  artifactBeingDragged?: IArtifactAsObject;
  onDropArtifact?: (id: string) => void;
  children: any;
};

export default function ToolPane({
  position,
  width,
  artifactBeingDragged,
  onDropArtifact,
  children,
}: Props) {
  const [dropTargetActive, setDropTargetActive] = useState(false);
  const style: React.CSSProperties = {
    position: "fixed",
    top: 0,
    bottom: 0,
    width,
    left: position === "left" ? 0 : undefined,
    right: position === "right" ? 0 : undefined,
    backgroundColor: dropTargetActive
      ? "var(--vscode-panel-dropBackground)"
      : "var(--vscode-sideBar-background)",
    borderLeft:
      position === "left"
        ? "var(--borderWidth) solid var(--vscode-sideBar-border)"
        : undefined,
    borderRight:
      position === "right"
        ? "var(--borderWidth) solid var(--vscode-sideBar-border)"
        : undefined,
    overflow: "auto",
  };
  const onDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    if (onDropArtifact) {
      ev.preventDefault();
      setDropTargetActive(!!artifactBeingDragged);
    }
  };
  const onDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
    if (onDropArtifact) {
      setDropTargetActive(false);
    }
  };
  const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    if (onDropArtifact) {
      setDropTargetActive(false);
      if (artifactBeingDragged?.artifactSymbol?.id) {
        onDropArtifact(artifactBeingDragged.artifactSymbol.id);
      }
    }
  };
  return (
    <div
      style={style}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}
