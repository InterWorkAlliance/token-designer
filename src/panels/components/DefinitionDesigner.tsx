import React, { useState } from "react";

import {
  TemplateDefinition,
  PropertySet,
  BehaviorGroup,
  Behavior,
} from "../../ttf/core_pb";
import { Artifact } from "../../ttf/artifact_pb";

import AnyArtifact from "./AnyArtifact";
import ArtifactInspector from "./ArtifactInspector";
import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import ToolPane from "./ToolPane";

import { TokenDesignerTaxonomy } from "../tokenDesignerTaxonomy";

type Props = {
  taxonomy: TokenDesignerTaxonomy | null;
  definition: TemplateDefinition.AsObject;
  incompatabilities: any;
  setDefinitionName: (name: string) => void;
  setDefinitionProperty: (
    artifactId: string,
    propertyName: string,
    value: string
  ) => void;
};

export default function DefinitionDesigner({
  taxonomy,
  definition,
  incompatabilities,
  setDefinitionName,
  setDefinitionProperty,
}: Props) {
  const [selectedArtifact, setSelectedArtifact] = useState<
    AnyArtifact | undefined
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

  const getArtifactByTooling: (
    tooling?: string
  ) => Artifact.AsObject | undefined = (tooling?: string) => {
    let result: Artifact.AsObject | undefined = taxonomy?.baseTokenTypes.find(
      (_) => _.artifact?.artifactSymbol?.tooling === tooling
    )?.artifact;
    if (!result) {
      result = taxonomy?.propertySets.find(
        (_) => _.artifact?.artifactSymbol?.tooling === tooling
      )?.artifact;
      if (!result) {
        result = taxonomy?.behaviors.find(
          (_) => _.artifact?.artifactSymbol?.tooling === tooling
        )?.artifact;
        if (!result) {
          result = taxonomy?.behaviorGroups.find(
            (_) => _.artifact?.artifactSymbol?.tooling === tooling
          )?.artifact;
        }
      }
    }
    return result;
  };

  const getArtifactById: (
    id: string,
    tooling?: string
  ) => Artifact.AsObject | undefined = (id: string, tooling?: string) => {
    let result: Artifact.AsObject | undefined = taxonomy?.baseTokenTypes.find(
      (_) => _.artifact?.artifactSymbol?.id === id
    )?.artifact;
    if (!result) {
      result = taxonomy?.propertySets.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )?.artifact;
      if (!result) {
        result = taxonomy?.behaviors.find(
          (_) => _.artifact?.artifactSymbol?.id === id
        )?.artifact;
        if (!result) {
          result = taxonomy?.behaviorGroups.find(
            (_) => _.artifact?.artifactSymbol?.id === id
          )?.artifact;
        }
      }
    }
    return result || getArtifactByTooling(tooling);
  };

  return (
    <>
      <CanvasPane
        left="0"
        right="25vw"
        definitionName={definition.artifact?.name}
        setDefinitionName={setDefinitionName}
      >
        <Canvas
          tokenBase={tokenBase}
          propertySets={propertySets}
          behaviorGroups={behaviorGroups}
          behaviors={behaviors}
          incompatabilities={incompatabilities}
          selectedArtifact={selectedArtifact}
          setSelectedArtifact={setSelectedArtifact}
        />
      </CanvasPane>
      <ToolPane position="right" width="25vw">
        <ArtifactInspector
          definition={definition}
          artifact={selectedArtifact || definition}
          getArtifactById={getArtifactById}
        />
      </ToolPane>
    </>
  );
}
