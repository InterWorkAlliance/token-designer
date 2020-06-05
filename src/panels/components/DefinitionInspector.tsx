import React from "react";

import { Artifact } from "../../ttf/artifact_pb";
import { TemplateDefinition } from "../../ttf/core_pb";

import ArtifactInspector from "./ArtifactInspector";
import ToolBoxTitle from "./ToolBoxTitle";
import PropertyInspector from "./PropertyInspector";

import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact?: Artifact.AsObject;
  definition: TemplateDefinition.AsObject;
};

export default function DefinitionInspector({
  taxonomy,
  definition,
  artifact,
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
      <ToolBoxTitle title={artifact?.name || ""} />
      <div style={descriptionAreaStyle}>
        <ArtifactInspector taxonomy={taxonomy} artifact={artifact} />
      </div>
      <ToolBoxTitle
        title={`${definition.artifact?.name || "Definition"} properties`}
      />
      <div style={propertiesAreaStyle}>
        <PropertyInspector taxonomy={taxonomy} definition={definition} />
      </div>
    </>
  );
}
