import React from 'react';

type Props = {

};

export default function Canvas ({  }: Props) {
  const style: React.CSSProperties = {
    border: 'var(--borderWidth) solid var(--vscode-panel-border)',
    color: 'var(--vscode-editor-foreground)',
    backgroundColor: 'var(--vscode-editor-background)',
    position: 'absolute',
    top: 'var(--padding)',
    bottom: 'var(--padding)',
    left: 'var(--padding)',
    right: 'var(--padding)',
    overflow: 'auto',
    textAlign: 'center',
  };
  return (
    <div style={style}>Canvas</div>
  );
}
