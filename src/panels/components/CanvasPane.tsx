import React from "react";

type Props = {
  left: string;
  right: string;
  children: any;
  formula?: string;
  formulaDescription?: string;
  setFormulaDescription?: (description: string) => void;
};

export default function CanvasPane({
  left,
  right,
  formula,
  children,
  formulaDescription,
  setFormulaDescription,
}: Props) {
  const style: React.CSSProperties = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left,
    right,
  };
  const formulaStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "calc(2*var(--padding))",
    right: "calc(2*var(--padding))",
    fontSize: "2em",
  };
  const formulaDescriptionStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "calc(2*var(--padding))",
    left: "calc(2*var(--padding))",
    width: "50%",
    border: "var(--borderWidth) solid var(--vscode-editor-background)",
    height: "3em",
    fontSize: "1.25em",
  };
  return (
    <div style={style}>
      {children}
      {formulaDescription && (
        <textarea
          style={formulaDescriptionStyle}
          defaultValue={formulaDescription}
          onBlur={
            setFormulaDescription
              ? (ev) => setFormulaDescription(ev.target.value)
              : undefined
          }
        />
      )}
      {formula && <span style={formulaStyle}>{formula}</span>}
    </div>
  );
}
