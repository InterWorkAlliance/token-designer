import React from "react";

import { Base } from "../../ttf/core_pb";

import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";
import ToolBox from "./ToolBox";

import { TokenDesignerTaxonomy } from "../tokenDesignerTaxonomy";

type Props = {
  taxonomy: TokenDesignerTaxonomy | null;
  formula: any;
};

export default function FormulaDesigner({ taxonomy, formula }: Props) {
  const toolPaneWidth = "25vw";
  const tokenBase = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.id === formula.tokenBase?.base?.id
  )?.artifact as Base.AsObject | undefined;
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
      <CanvasPane left={toolPaneWidth} right={toolPaneWidth}>
        <Canvas tokenBase={tokenBase} />
      </CanvasPane>
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
