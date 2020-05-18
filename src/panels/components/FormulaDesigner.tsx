import React from "react";

import { TemplateFormula } from "../../ttf/core_pb";
import { Artifact } from "../../ttf/artifact_pb";

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
  )?.artifact;

  const propertySets = formula.propertySetsList
    .map((_) => _.propertySet?.id)
    .map((id) =>
      taxonomy?.propertySets.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .map (_ => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

  const behaviorGroups = formula.behaviorGroupsList
    .map((_) => _.behaviorGroup?.id)
    .map((id) =>
      taxonomy?.behaviorGroups.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )
    )
    .map (_ => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

  const behaviors = formula.behaviorsList
    .map((_) => _.behavior?.id)
    .map((id) =>
      taxonomy?.behaviors.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .map (_ => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

  return (
    <>
      <ToolPane position="left" width={toolPaneWidth}>
        <ToolBox
          title="Token Bases"
          type="token-base"
          tools={(taxonomy?.baseTokenTypes || []).map((_) => _.artifact)}
        />
        <ToolBox
          title="Property Sets"
          type="property-set"
          tools={(taxonomy?.propertySets || []).map((_) => _.artifact)}
        />
      </ToolPane>
      <CanvasPane
        left={toolPaneWidth}
        right={toolPaneWidth}
        formula={formula.artifact?.artifactSymbol?.tooling}
      >
        <Canvas
          tokenBase={tokenBase}
          propertySets={propertySets}
          behaviorGroups={behaviorGroups}
          behaviors={behaviors}
        />
      </CanvasPane>
      <ToolPane position="right" width={toolPaneWidth}>
        <ToolBox
          title="Behaviors"
          type="behavior"
          tools={(taxonomy?.behaviors || []).map((_) => _.artifact)}
        />
        <ToolBox
          title="Behavior Groups"
          type="behavior-group"
          tools={(taxonomy?.behaviorGroups || []).map((_) => _.artifact)}
        />
      </ToolPane>
    </>
  );
}