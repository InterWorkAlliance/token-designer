import React from "react";

import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";
import ToolBox from "./ToolBox";

import { TokenDesignerTaxonomy } from "../tokenDesignerTaxonomy";

type Props = {
  taxonomy: TokenDesignerTaxonomy | null;
};

export default function FormulaDesigner({ taxonomy }: Props) {
  const toolPaneWidth = "25vw";
  return (
    <>
      <ToolPane position="left" width={toolPaneWidth}>
        <ToolBox
          title="Token Bases"
          type="token-base"
          tools={taxonomy?.baseTokenTypes || []}
        />
        <ToolBox
          title="Property Sets"
          type="property-set"
          tools={taxonomy?.propertySets || []}
        />
      </ToolPane>
      <CanvasPane left={toolPaneWidth} right={toolPaneWidth} />
      <ToolPane position="right" width={toolPaneWidth}>
        <ToolBox
          title="Behaviors"
          type="behavior"
          tools={taxonomy?.behaviors || []}
        />
        <ToolBox
          title="Behavior Groups"
          type="behavior-group"
          tools={taxonomy?.behaviorGroups || []}
        />
      </ToolPane>
    </>
  );
}
