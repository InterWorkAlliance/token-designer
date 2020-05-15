import React from 'react';

import ToolBoxTitle from './ToolBoxTitle';

import { Base, PropertySet, Behavior, BehaviorGroup } from '../../ttf/core_pb';

type Props = {
  title: string,
  artifacts: (Base.AsObject | PropertySet.AsObject | Behavior.AsObject | BehaviorGroup.AsObject)[],
};

export default function ({ title, artifacts }: Props) {
  const itemsAreaStyle: React.CSSProperties = {
    maxHeight: '45vh',
    overflowY: 'auto',
    margin: 'var(--padding)',
    padding: 'var(--padding)',
  };
  return (
    <>
      <ToolBoxTitle title={title} />
      <div style={itemsAreaStyle}>
        {
          artifacts.map(artifact => (
            <span>{artifact.artifact?.name}</span>
          ))
        }
      </div>
    </>
  );
}
