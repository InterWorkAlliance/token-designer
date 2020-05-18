import React from 'react';

type Props = {
  left: string,
  right: string,
  children: any,
};

export default function CanvasPane ({ left, right, children }: Props) {
  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left,
    right,
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
}
