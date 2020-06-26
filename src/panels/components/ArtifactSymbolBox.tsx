import React from "react";

import { taxonomy } from "../../ttf/protobufs";

type Props = {
  symbol: taxonomy.model.artifact.IArtifactSymbol;
};

export default function ArtifactSymbolBox({ symbol }: Props) {
  const badgeStyle: React.CSSProperties = {
    backgroundColor: "var(--vscode-editor-background)",
    color: "var(--vscode-editor-foreground)",
    border:
      "var(--borderWidth) solid var(--vscode-sideBarSectionHeader-border)",
    marginRight: "var(--padding)",
    marginBottom: "var(--padding)",
    padding: "var(--paddingBig)",
    fontSize: "1.6em",
    minWidth: "2em",
    textAlign: "center",
    fontWeight: "bold",
    float: "left",
  };

  return <span style={badgeStyle}>{symbol.tooling || "?"}</span>;
}
