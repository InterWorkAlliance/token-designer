import React from "react";

import { Base, PropertySet, BehaviorGroup, Behavior } from "../../ttf/core_pb";

import ArtifactIcon from "./ArtifactIcon";

type Props = {
  tokenBase?: Base.AsObject;
  propertySets?: PropertySet.AsObject[];
  behaviorGroups?: BehaviorGroup.AsObject[];
  behaviors?: Behavior.AsObject[];
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
            title={tokenBase?.name || "Unknown"}
            type={tokenBase ? "token-base" : "unknown"}
          />
          {(propertySets || []).map((_) => (
            <ArtifactIcon
              key={_.artifact?.artifactSymbol?.id}
              title={_.artifact?.name || "Unknown"}
              type="property-set"
            />
          ))}
        </div>
        <div style={{ width: "var(--iconWidth)" }}>
          {(behaviorGroups || []).map((_) => (
            <ArtifactIcon
              key={_.artifact?.artifactSymbol?.id}
              title={_.artifact?.name || "Unknown"}
              type="behavior-group"
            />
          ))}
          {(behaviors || []).map((_) => (
            <ArtifactIcon
              key={_.artifact?.artifactSymbol?.id}
              title={_.artifact?.name || "Unknown"}
              type="behavior"
            />
          ))}

{(behaviors || []).map((_) => (
            <ArtifactIcon
              key={_.artifact?.artifactSymbol?.id}
              title={_.artifact?.name || "Unknown"}
              type="behavior"
            />
          ))}{(behaviors || []).map((_) => (
            <ArtifactIcon
              key={_.artifact?.artifactSymbol?.id}
              title={_.artifact?.name || "Unknown"}
              type="behavior"
            />
          ))}

        </div>
      </span>
    </div>
  );
}
