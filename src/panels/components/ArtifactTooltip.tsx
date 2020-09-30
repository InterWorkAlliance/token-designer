import React, { useEffect, useState } from "react";

import ArtifactInspector from "./inspectors/ArtifactInspector";
import AnyArtifact from "./AnyArtifact";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact: AnyArtifact;
  setTipHover: (newArtifact: AnyArtifact | null) => void;
};

const HIT_DISTANCE = 30;

export default function ArtifactTooltip({
  taxonomy,
  artifact,
  setTipHover,
}: Props) {
  const [tipPosition, setTipPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (ev: MouseEvent): void => {
      if (tipPosition.x === 0 || tipPosition.y === 0) {
        setTipPosition({ x: ev.clientX, y: ev.clientY });
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  });
  useEffect(() => setTipPosition({ x: 0, y: 0 }), [artifact]);
  if (tipPosition.x === 0 && tipPosition.y === 0) {
    return <></>;
  }
  return (
    <div
      style={{
        position: "fixed",
        right:
          tipPosition.x >= window.innerWidth / 2
            ? window.innerWidth - tipPosition.x
            : undefined,
        left:
          tipPosition.x < window.innerWidth / 2
            ? tipPosition.x
            : undefined,
        top:
          tipPosition.y < window.innerHeight / 2
            ? tipPosition.y
            : undefined,
        bottom:
          tipPosition.y >= window.innerHeight / 2
            ? window.innerHeight - tipPosition.y
            : undefined,

        zIndex: 100,
      }}
      onMouseEnter={() => setTipHover(artifact)}
      onMouseLeave={() => setTipHover(null)}
    >
      <div
        style={{
          margin: HIT_DISTANCE,
          width: 400,
          maxWidth: "90vw",
          height: 300,
          maxHeight: "40vh",
          backgroundColor: "var(--vscode-editorHoverWidget-background)",
          color: "var(--vscode-editorHoverWidget-foreground)",
          border: "1px solid var(--vscode-editorHoverWidget-border)",
          padding: 10,
          boxShadow: "3px 3px var(--vscode-widget-shadow)",
          overflow: "auto",
        }}
      >
        <div>
          <strong>{artifact.artifact?.name}</strong>
        </div>
        <ArtifactInspector taxonomy={taxonomy} artifact={artifact} />
      </div>
    </div>
  );
}
