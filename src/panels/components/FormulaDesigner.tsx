import React, { useState } from "react";

import {
  TemplateFormula,
  PropertySet,
  BehaviorGroup,
  Behavior,
} from "../../ttf/core_pb";

import ArtifactTooltip from "./ArtifactTooltip";
import ArtifactType from "./ArtifactType";
import AnyArtifact from "./AnyArtifact";
import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import ToolPane from "./ToolPane";
import ToolBox from "./ToolBox";

type Props = {
  taxonomy: TaxonomyAsObjects | null;
  formula: TemplateFormula.AsObject;
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
  const [iconHover, setIconHover] = useState<AnyArtifact | null>(null);
  const [tipHover, setTipHover] = useState<AnyArtifact | null>(null);

  const [artifactBeingDraggedOn, setArtifactBeingDraggedOn] = useState<
    [AnyArtifact, ArtifactType] | undefined
  >(undefined);

  const [artifactBeingDraggedOff, setArtifactBeingDraggedOff] = useState<
    [AnyArtifact, ArtifactType] | undefined
  >(undefined);

  const toolPaneWidth = "25vw";

  const tokenBase = taxonomy?.baseTokenTypes.find(
    (_) => _.artifact?.artifactSymbol?.id === formula.tokenBase?.base?.id
  );

  const propertySets = formula.propertySetsList
    .map((_) => _.propertySet?.id)
    .map((id) =>
      taxonomy?.propertySets.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .filter((_) => !!_) as PropertySet.AsObject[];

  const behaviorGroups = formula.behaviorGroupsList
    .map((_) => _.behaviorGroup?.id)
    .map((id) =>
      taxonomy?.behaviorGroups.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )
    )
    .filter((_) => !!_) as BehaviorGroup.AsObject[];

  const behaviors = formula.behaviorsList
    .map((_) => _.behavior?.id)
    .map((id) =>
      taxonomy?.behaviors.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .filter((_) => !!_) as Behavior.AsObject[];

  const tooltipContents = iconHover || tipHover;

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
          tools={taxonomy?.baseTokenTypes || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setIconHover}
        />
        <ToolBox
          title="Property Sets"
          type="property-set"
          tools={taxonomy?.propertySets || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setIconHover}
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
          setToolTip={setIconHover}
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
          tools={taxonomy?.behaviors || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setIconHover}
        />
        <ToolBox
          title="Behavior Groups"
          type="behavior-group"
          tools={taxonomy?.behaviorGroups || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setIconHover}
        />
      </ToolPane>

      {!!taxonomy && !!tooltipContents && (
        <ArtifactTooltip
          taxonomy={taxonomy}
          artifact={tooltipContents}
          setTipHover={setTipHover}
        />
      )}
    </>
  );
}
