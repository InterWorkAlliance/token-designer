import React from "react";

type Props = {
  title: string;
  onRename?: () => void;
};

export default function ToolBoxTitle({ title, onRename }: Props) {
  const style: React.CSSProperties = {
    backgroundColor: "var(--vscode-sideBarSectionHeader-background)",
    color: "var(--vscode-sideBarTitle-foreground)",
    border:
      "var(--borderWidth) solid var(--vscode-sideBarSectionHeader-border)",
    margin: "var(--padding)",
    padding: "var(--padding)",
    fontSize: "1.2em",
  };
  return (
    <h1 style={style}>
      {title}
      {!!onRename && (
        <span
          style={{ cursor: "pointer", marginLeft: 5 }}
          onClick={onRename}
        >
          ✎
        </span>
      )}
    </h1>
  );
}
