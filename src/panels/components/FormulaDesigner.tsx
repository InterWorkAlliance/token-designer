import React from 'react';

import CanvasPane from './CanvasPane';
import ToolPane from './ToolPane';
import ToolBox from './ToolBox';

import { TokenDesignerTaxonomy } from '../tokenDesignerTaxonomy';

type Props = {
  taxonomy: TokenDesignerTaxonomy | null,
};

export default function ({ taxonomy }: Props) {
  const toolPaneWidth = '25vw';
  return (
    <>
      <ToolPane position="left" width={toolPaneWidth}>
        <ToolBox title="Token Bases" artifacts={taxonomy?.baseTokenTypes || []} />
        <ToolBox title="Property Sets" artifacts={taxonomy?.propertySets || []} />
      </ToolPane>
      <CanvasPane 
        left={toolPaneWidth} 
        right={toolPaneWidth} />
      <ToolPane position="right" width={toolPaneWidth}>
        <ToolBox title="Behaviors" artifacts={taxonomy?.behaviors || []} />
        <ToolBox title="Behavior Groups" artifacts={taxonomy?.behaviorGroups || []} />
      </ToolPane>
    </>
  );
}
