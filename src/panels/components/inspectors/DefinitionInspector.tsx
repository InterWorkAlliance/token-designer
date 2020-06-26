import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import AllPropertiesInspector from "./AllPropertiesInspector";
import AnyArtifact from "../AnyArtifact";
import ArtifactInspector from "./ArtifactInspector";
import ArtifactType from "../ArtifactType";
import ToolBoxTitle from "../ToolBoxTitle";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
  definition: taxonomy.model.core.ITemplateDefinition;
};

export default function DefinitionInspector({
  taxonomy,
  artifact,
  artifactType,
  definition,
}: Props) {
  const descriptionAreaStyle: React.CSSProperties = {
    height: "70vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  const propertiesAreaStyle: React.CSSProperties = {
    height: "20vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  return (
    <>
      <ToolBoxTitle title={artifact?.artifact?.name || ""} />
      <div style={descriptionAreaStyle}>
        <ArtifactInspector
          taxonomy={taxonomy}
          artifact={artifact}
          artifactType={artifactType}
        />
      </div>
      <ToolBoxTitle
        title={`${definition.artifact?.name || "Definition"} properties`}
      />
      <div style={propertiesAreaStyle}>
        <AllPropertiesInspector taxonomy={taxonomy} definition={definition} />
      </div>
    </>
  );
}
