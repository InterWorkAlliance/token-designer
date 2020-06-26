import React, { useState } from "react";

import { taxonomy } from "../../ttf/protobufs";

import AnyArtifact from "./AnyArtifact";
import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";
import ToolBox from "./ToolBox";

import ArtifactType from "./ArtifactType";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy | null;
  formula: taxonomy.model.core.ITemplateFormula;
  incompatabilities: any;
  addArtifact: (id: string) => void;
  removeArtifact: (id: string) => void;
  setFormulaDescription: (description: string) => void;
};

export default function FormulaDesigner({
  taxonomy,
  formula,
  incompatabilities,
  addArtifact,
  removeArtifact,
  setFormulaDescription,
}: Props) {
  const [artifactBeingDraggedOn, setArtifactBeingDraggedOn] = useState<
    [AnyArtifact, ArtifactType] | undefined
  >(undefined);

  const [artifactBeingDraggedOff, setArtifactBeingDraggedOff] = useState<
    [AnyArtifact, ArtifactType] | undefined
  >(undefined);

  const toolPaneWidth = "25vw";

  const tokenBase = (taxonomy?.baseTokenTypes || {})[
    formula.tokenBase?.base?.id || ""
  ];

  const propertySets = formula.propertySets
    ?.map((_) => _.propertySet?.id)
    .map((id) => (taxonomy?.propertySets || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IPropertySet[];

  const behaviorGroups = formula.behaviorGroups
    ?.map((_) => _.behaviorGroup?.id)
    .map((id) => (taxonomy?.behaviorGroups || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IBehaviorGroup[];

  const behaviors = formula.behaviors
    ?.map((_) => _.behavior?.id)
    .map((id) => (taxonomy?.behaviors || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IBehavior[];

  return (
    <>
      <ToolPane
        position="left"
        width={toolPaneWidth}
        artifactBeingDragged={
          artifactBeingDraggedOff ? artifactBeingDraggedOff[0] : undefined
        }
        onDropArtifact={removeArtifact}
      >
        <ToolBox
          title="Token Bases"
          type="token-base"
          tools={Object.values(taxonomy?.baseTokenTypes || {}) || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
        />
        <ToolBox
          title="Property Sets"
          type="property-set"
          tools={Object.values(taxonomy?.propertySets || {}) || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
        />
      </ToolPane>

      <CanvasPane
        left={toolPaneWidth}
        right={toolPaneWidth}
        formula={formula.artifact?.artifactSymbol?.tooling}
        formulaDescription={
          formula.artifact?.artifactDefinition?.businessDescription
        }
        setFormulaDescription={setFormulaDescription}
      >
        <Canvas
          tokenBase={tokenBase}
          propertySets={propertySets}
          behaviorGroups={behaviorGroups}
          behaviors={behaviors}
          incompatabilities={incompatabilities}
          artifactBeingDraggedOn={artifactBeingDraggedOn}
          artifactOnDragStart={setArtifactBeingDraggedOff}
          addArtifact={addArtifact}
        />
      </CanvasPane>

      <ToolPane
        position="right"
        width={toolPaneWidth}
        artifactBeingDragged={
          artifactBeingDraggedOff ? artifactBeingDraggedOff[0] : undefined
        }
        onDropArtifact={removeArtifact}
      >
        <ToolBox
          title="Behaviors"
          type="behavior"
          tools={Object.values(taxonomy?.behaviors || {}) || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
        />
        <ToolBox
          title="Behavior Groups"
          type="behavior-group"
          tools={Object.values(taxonomy?.behaviorGroups || {}) || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
        />
      </ToolPane>
    </>
  );
}
