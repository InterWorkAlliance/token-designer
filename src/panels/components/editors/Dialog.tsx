import React from "react";

const buttonStyle: React.CSSProperties = {
  padding: 5,
  margin: 5,
  minWidth: "10%",
};

type Props = {
  children: any;
  hide: () => void;
  onSubmit: () => void;
};

export default function Dialog({ children, hide, onSubmit }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.5)",
      }}
    >
      <form
        onSubmit={() => {
          onSubmit();
          hide();
        }}
        style={{
          padding: 20,
          maxHeight: "90%",
          maxWidth: "90%",
          overflow: "auto",
          backgroundColor: "var(--vscode-editor-background)",
          border:
            "var(--borderWidth) solid var(--vscode-editor-selectionBackground)",
        }}
      >
        {children}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={hide}
            style={{
              ...buttonStyle,
              backgroundColor: "var(--vscode-button-secondaryBackground)",
              color: "var(--vscode-button-secondaryForeground)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: "var(--vscode-button-background)",
              color: "var(--vscode-button-foreground)",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
