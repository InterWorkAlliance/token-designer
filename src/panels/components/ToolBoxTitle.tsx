import React from "react";

import EditLink from "./links/EditLink";

type Props = {
  title: string;
  editMode?: boolean;
  onRename?: () => void;
  setEditMode?: (editMode: boolean) => void;
};

export default function ToolBoxTitle({
  title,
  editMode,
  onRename,
  setEditMode,
}: Props) {
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
      {!!onRename && <EditLink onClick={onRename} />}
      {!!setEditMode && (
        <span
          style={{
            float: "right",
            cursor: "pointer",
            textDecoration: "underline",
            marginRight: 5,
          }}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done editing" : "Make changes"}
        </span>
      )}
    </h1>
  );
}
