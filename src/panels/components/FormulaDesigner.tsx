import React from "react";

import { Base, TemplateFormula, PropertySet } from "../../ttf/core_pb";

import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";
import ToolBox from "./ToolBox";

import { TokenDesignerTaxonomy } from "../tokenDesignerTaxonomy";

type Props = {
  taxonomy: TokenDesignerTaxonomy | null;
  formula: TemplateFormula.AsObject;
};

export default function FormulaDesigner({ taxonomy, formula }: Props) {
  const toolPaneWidth = "25vw";

  const tokenBase = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.id === formula.tokenBase?.base?.id
  )?.artifact as Base.AsObject | undefined;

  const propertySets = formula.propertySetsList
    .map((_) => _.propertySet?.id)
    .map((id) =>
      taxonomy?.propertySets.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .filter((_) => !!_) as PropertySet.AsObject[];

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
        <Canvas tokenBase={tokenBase} propertySets={propertySets} />
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
