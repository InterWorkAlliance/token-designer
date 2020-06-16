import React, { useState } from "react";

import {
  TemplateDefinition,
  PropertySet,
  BehaviorGroup,
  Behavior,
} from "../../ttf/core_pb";

import AnyArtifact from "./AnyArtifact";
import ArtifactType from "./ArtifactType";
import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import DefinitionInspector from "./inspectors/DefinitionInspector";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import ToolPane from "./ToolPane";

type Props = {
  taxonomy: TaxonomyAsObjects;
  definition: TemplateDefinition.AsObject;
  setDefinitionName: (name: string) => void;
};

export default function DefinitionDesigner({
  taxonomy,
  definition,
  setDefinitionName,
}: Props) {
  const [selectedArtifact, setSelectedArtifact] = useState<
    [AnyArtifact, ArtifactType] | undefined
  >(undefined);

  const tokenBase = taxonomy?.baseTokenTypes.find(
    (_) =>
      _.artifact?.artifactSymbol?.id === definition.tokenBase?.reference?.id
  );

  const propertySets = definition.propertySetsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.propertySets.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .filter((_) => !!_) as PropertySet.AsObject[];

  const behaviorGroups = definition.behaviorGroupsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.behaviorGroups.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )
    )
    .filter((_) => !!_) as BehaviorGroup.AsObject[];

  const behaviors = definition.behaviorsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.behaviors.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .filter((_) => !!_) as Behavior.AsObject[];

  const rightPaneWidth = "35vw";

  return (
    <>
      <CanvasPane
        left="0"
        right={rightPaneWidth}
        definitionName={definition.artifact?.name}
        setDefinitionName={setDefinitionName}
      >
        <Canvas
          tokenBase={tokenBase}
          propertySets={propertySets}
          behaviorGroups={behaviorGroups}
          behaviors={behaviors}
          selectedArtifact={selectedArtifact}
          setSelectedArtifact={setSelectedArtifact}
        />
      </CanvasPane>
      <ToolPane position="right" width={rightPaneWidth}>
        <DefinitionInspector
          taxonomy={taxonomy}
          definition={definition}
          artifact={selectedArtifact ? selectedArtifact[0] : definition}
          artifactType={
            selectedArtifact ? selectedArtifact[1] : "template-definition"
          }
        />
      </ToolPane>
    </>
  );
}
