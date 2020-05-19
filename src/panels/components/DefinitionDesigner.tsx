import React, { useState } from "react";

import { TemplateDefinition } from "../../ttf/core_pb";
import { Artifact } from "../../ttf/artifact_pb";

import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";

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
    <CanvasPane left="0" right="0">
      <Canvas
        tokenBase={tokenBase}
        propertySets={propertySets}
        behaviorGroups={behaviorGroups}
        behaviors={behaviors}
        incompatabilities={incompatabilities}
      />
    </CanvasPane>
  );
}
