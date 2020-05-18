import React from 'react';

type Props = {
  position: 'left' | 'right',
  width: string,
  children: any,
};

export default function ToolPane ({ position, width, children }: Props) {
  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    width,
    left: position === 'left' ? 0 : undefined,
    right: position === 'right' ? 0 : undefined,
    backgroundColor: 'var(--vscode-sideBar-background)',
    borderLeft: position === 'left' ? 'var(--borderWidth) solid var(--vscode-sideBar-border)' : undefined,
    borderRight: position === 'right' ? 'var(--borderWidth) solid var(--vscode-sideBar-border)' : undefined,
    overflow: 'auto',
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
}
