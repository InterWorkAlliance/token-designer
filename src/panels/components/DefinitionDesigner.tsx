import React, { useState } from "react";

import { TemplateDefinition } from "../../ttf/core_pb";
import { Artifact } from "../../ttf/artifact_pb";

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
    Artifact.AsObject | undefined
  >(undefined);

  const tokenBase = taxonomy?.baseTokenTypes.find(
    (_) =>
      _.artifact?.artifactSymbol?.id === definition.tokenBase?.reference?.id
  )?.artifact;

  const propertySets = definition.propertySetsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.propertySets.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .map((_) => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

  const behaviorGroups = definition.behaviorGroupsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.behaviorGroups.find(
        (_) => _.artifact?.artifactSymbol?.id === id
      )
    )
    .map((_) => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

  const behaviors = definition.behaviorsList
    .map((_) => _.reference?.id)
    .map((id) =>
      taxonomy?.behaviors.find((_) => _.artifact?.artifactSymbol?.id === id)
    )
    .map((_) => _?.artifact)
    .filter((_) => !!_) as Artifact.AsObject[];

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
        {selectedArtifact && <ArtifactInspector artifact={selectedArtifact} />}
      </ToolPane>
    </>
  );
}
