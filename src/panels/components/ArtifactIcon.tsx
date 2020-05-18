import React from "react";

import ArtifactType from "./ArtifactType";

type Props = {
  title: string;
  type: ArtifactType | "unknown";
};

export default function ArtifactIcon({ title, type }: Props) {
  const style: React.CSSProperties = {
    cursor: 'pointer',
    display: 'inline-block',
    width: 'var(--iconWidth)',
    textAlign: 'center',
    margin: 'var(--paddingSmall)',
    padding: 'var(--paddingSmall)',
  };
  const imgStyle: React.CSSProperties = {
    width: '3.5em',
    margin: 'var(--paddingSmall)',
    padding: 'var(--paddingSmall)',
  };
  const titleStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 'var(--paddingSmall)',
    padding: 'var(--paddingSmall)',
  };
  let imgSrc = "token-designer/unknown.svg";
  switch (type) {
    case "token-base":
      imgSrc = "token-designer/token-base.svg";
      break;
    case "property-set":
      imgSrc = "token-designer/property-set.svg";
      break;
    case "behavior":
      imgSrc = "token-designer/behavior.svg";
      break;
    case "behavior-group":
      imgSrc = "token-designer/behavior-group.svg";
      break;
  }
  return (
    <span style={style} title={title}>
      <img src={imgSrc} style={imgStyle} />
      <div style={titleStyle}>{title}</div>
    </span>
  );
}
