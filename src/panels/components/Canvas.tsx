import React from "react";

import { Artifact } from "../../ttf/artifact_pb";

import ArtifactIcon from "./ArtifactIcon";

type Props = {
  tokenBase?: Artifact.AsObject;
  propertySets?: Artifact.AsObject[];
  behaviorGroups?: Artifact.AsObject[];
  behaviors?: Artifact.AsObject[];
};

export default function Canvas({
  tokenBase,
  propertySets,
  behaviorGroups,
  behaviors,
}: Props) {
  const style: React.CSSProperties = {
    border: "var(--borderWidth) solid var(--vscode-panel-border)",
    color: "var(--vscode-editor-foreground)",
    backgroundColor: "var(--vscode-editor-background)",
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
  return (
    <div style={style}>
      <span style={utlizedAreaStyle}>
        <div>
          <ArtifactIcon
            artifact={tokenBase}
            type={tokenBase ? "token-base" : "unknown"}
          />
          {(propertySets || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="property-set"
            />
          ))}
        </div>
        <div style={{ width: "var(--iconWidth)" }}>
          {(behaviorGroups || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="behavior-group"
            />
          ))}
          {(behaviors || []).map((_) => (
            <ArtifactIcon
              key={_.artifactSymbol?.id}
              artifact={_}
              type="behavior"
            />
          ))}
        </div>
      </span>
    </div>
  );
}
