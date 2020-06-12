import React from "react";

import { TemplateDefinition } from "../../ttf/core_pb";

import AllPropertiesInspector from "./AllPropertiesInspector";
import AnyArtifact from "./AnyArtifact";
import ArtifactInspector from "./ArtifactInspector";
import ArtifactType from "./ArtifactType";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";
import ToolBoxTitle from "./ToolBoxTitle";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
  definition: TemplateDefinition.AsObject;
};

export default function DefinitionInspector({
  taxonomy,
  artifact,
  artifactType,
  definition,
}: Props) {
  const descriptionAreaStyle: React.CSSProperties = {
    height: "45vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  const propertiesAreaStyle: React.CSSProperties = {
    height: "45vh",
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
