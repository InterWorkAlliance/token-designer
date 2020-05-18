import React from 'react';

type Props = {
  left: string,
  right: string,
  children: any,
  formula?: string,
};

export default function CanvasPane ({ left, right, formula, children }: Props) {
  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left,
    right,
  };
  const formulaStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 'calc(2*var(--padding))',
    right: 'calc(2*var(--padding))',
    fontSize: '2em',
  };
  return (
    <div style={style}>
      {children}
      <span style={formulaStyle}>
        {formula}
      </span>
    </div>
  );
}
