import { load } from "@grpc/grpc-js";
import React from "react";

import { ArtifactSymbol } from "../../ttf/artifact_pb";
import EditLink from "./links/EditLink";

type Props = {
  symbol: ArtifactSymbol.AsObject;
  edit?: () => void;
  loadFormula?: (tooling: string) => void;
};

export default function ArtifactSymbolBox({
  symbol,
  edit,
  loadFormula,
}: Props) {
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
    cursor: !!loadFormula ? "pointer" : undefined,
  };

  return (
    <span
      style={badgeStyle}
      onClick={loadFormula ? () => loadFormula(symbol.tooling) : undefined}
      title={loadFormula ? "Click to view or edit this formula" : undefined}
    >
      {symbol.tooling || "?"}
      {!!edit && <EditLink onClick={edit} />}
    </span>
  );
}
