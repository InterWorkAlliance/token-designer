import React, { useState } from "react";

import {
  TemplateFormula,
  PropertySet,
  BehaviorGroup,
  Behavior,
} from "../../ttf/core_pb";

import ArtifactInspector from "./inspectors/ArtifactInspector";
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
  const [toolTip, setToolTip] = useState<AnyArtifact | null>(null);

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
          setToolTip={setToolTip}
        />
        <ToolBox
          title="Property Sets"
          type="property-set"
          tools={taxonomy?.propertySets || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setToolTip}
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
          setToolTip={setToolTip}
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
          setToolTip={setToolTip}
        />
        <ToolBox
          title="Behavior Groups"
          type="behavior-group"
          tools={taxonomy?.behaviorGroups || []}
          artifactOnDragStart={setArtifactBeingDraggedOn}
          setToolTip={setToolTip}
        />
      </ToolPane>

      {!!taxonomy && !!toolTip && (
        <div
          style={{
            position: "fixed",
            right: 15,
            bottom: 15,
            width: 400,
            maxWidth: "90vw",
            height: 300,
            maxHeight: "40vh",
            backgroundColor: "var(--vscode-editorHoverWidget-background)",
            color: "var(--vscode-editorHoverWidget-foreground)",
            border: "1px solid var(--vscode-editorHoverWidget-border)",
            padding: 10,
            zIndex: 100,
            boxShadow: "3px 3px var(--vscode-widget-shadow)",
          }}
        >
          <ArtifactInspector
            taxonomy={taxonomy}
            artifact={toolTip}
            summaryOnly={true}
          />
        </div>
        )}
    </>
  );
}
