import React, { useState } from "react";

import { taxonomy } from "../../ttf/protobufs";

import AnyArtifact from "./AnyArtifact";
import ArtifactType from "./ArtifactType";
import Canvas from "./Canvas";
import CanvasPane from "./CanvasPane";
import DefinitionInspector from "./inspectors/DefinitionInspector";
import ToolPane from "./ToolPane";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  definition: taxonomy.model.core.ITemplateDefinition;
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

  const tokenBase = (taxonomy?.baseTokenTypes || {})[
    definition.tokenBase?.reference?.id || ""
  ];

  const propertySets = definition.propertySets
    ?.map((_) => _.reference?.id)
    .map((id) => (taxonomy?.propertySets || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IPropertySet[];

  const behaviorGroups = definition.behaviorGroups
    ?.map((_) => _.reference?.id)
    .map((id) => (taxonomy?.behaviorGroups || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IBehaviorGroup[];

  const behaviors = definition.behaviors
    ?.map((_) => _.reference?.id)
    .map((id) => (taxonomy?.behaviors || {})[id || ""])
    .filter((_) => !!_) as taxonomy.model.core.IBehavior[];

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
