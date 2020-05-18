import React, { useState } from "react";

import { Artifact } from "../../ttf/artifact_pb";

type Props = {
  position: "left" | "right";
  width: string;
  artifactBeingDraggedOff?: Artifact.AsObject;
  children: any;
};

export default function ToolPane({
  position,
  width,
  children,
  artifactBeingDraggedOff,
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
    ev.preventDefault();
    setDropTargetActive(!!artifactBeingDraggedOff);
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
      {children}
    </div>
  );
}
