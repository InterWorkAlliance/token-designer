import React from "react";

import { Artifact } from "../../ttf/artifact_pb";
import { TemplateDefinition } from "../../ttf/core_pb";

import AnyArtifact from "./AnyArtifact";
import ArtifactReference from "./ArtifactReference";
import ToolBoxTitle from "./ToolBoxTitle";
import PropertyInspector from "./PropertyInspector";

type Props = {
  artifact?: AnyArtifact | TemplateDefinition.AsObject;
  definition: TemplateDefinition.AsObject;
  getArtifactById: (
    id: string,
    tooling?: string
  ) => Artifact.AsObject | undefined;
};

export default function ArtifactInspector({
  definition,
  artifact,
  getArtifactById,
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
  const badgeStyle: React.CSSProperties = {
    backgroundColor: "var(--vscode-editor-background)",
    color: "var(--vscode-editor-foreground)",
    border:
      "var(--borderWidth) solid var(--vscode-sideBarSectionHeader-border)",
    marginRight: "var(--padding)",
    marginBottom: "var(--padding)",
    padding: "var(--paddingBig)",
    fontSize: "1.6em",
    minWidth: "2em",
    textAlign: "center",
    fontWeight: "bold",
    float: "left",
  };
  return (
    <>
      {!!artifact?.artifact && (
        <>
          <ToolBoxTitle title={artifact.artifact.name} />
          <div style={descriptionAreaStyle}>
            {!!artifact.artifact.aliasesList?.length && (
              <p>
                <b>Aliases: {artifact.artifact.aliasesList.join(", ")}</b>
              </p>
            )}
            {!artifact.artifact.aliasesList?.length && <p></p>}
            {!!artifact.artifact.artifactSymbol?.tooling && (
              <span style={badgeStyle}>
                {artifact.artifact.artifactSymbol?.tooling}
              </span>
            )}
            {artifact.artifact.artifactDefinition?.businessDescription && (
              <p>{artifact.artifact.artifactDefinition?.businessDescription}</p>
            )}
            {artifact.artifact.artifactDefinition?.businessExample && (
              <p>
                For example:{" "}
                <i>{artifact.artifact.artifactDefinition?.businessExample}</i>
              </p>
            )}
            {artifact.artifact.artifactDefinition?.comments && (
              <p>
                <i>Note:</i> {artifact.artifact.artifactDefinition?.comments}
              </p>
            )}
            {!!artifact.artifact.artifactDefinition?.analogiesList?.length && (
              <div>
                <u>Analogies:</u>
                <ul>
                  {artifact.artifact.artifactDefinition?.analogiesList.map(
                    (_) => (
                      <li key={JSON.stringify(_)}>
                        {_.name}
                        <ul>
                          <li>{_.description}</li>
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {!!artifact.artifact.contributorsList?.length && (
              <div>
                <u>Contributors:</u>
                <ul>
                  {artifact.artifact.contributorsList.map((_) => (
                    <li key={JSON.stringify(_)}>
                      {_.name}
                      {_.name && _.organization && <>, </>}
                      <i>{_.organization}</i>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!artifact.artifact.dependenciesList?.length && (
              <div>
                <u>Dependencies:</u>
                <ul>
                  {artifact.artifact.dependenciesList.map((_) => (
                    <li key={JSON.stringify(_)}>
                      <ArtifactReference
                        getArtifactById={getArtifactById}
                        id={_.symbol?.id}
                        tooling={_.symbol?.tooling}
                      />
                      {_.description && <> ({_.description})</>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!artifact.artifact.influencedBySymbolsList?.length && (
              <div>
                <u>Influenced by:</u>
                <ul>
                  {artifact.artifact.influencedBySymbolsList.map((_) => (
                    <li key={JSON.stringify(_)}>
                      <b>
                        <ArtifactReference
                          getArtifactById={getArtifactById}
                          id={_.symbol?.id}
                          tooling={_.symbol?.tooling}
                        />
                      </b>
                      {_.description && (
                        <>
                          <br />
                          {_.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!artifact.artifact.incompatibleWithSymbolsList?.length && (
              <div>
                <u>Incompatible with:</u>
                <ul>
                  {artifact.artifact.incompatibleWithSymbolsList.map((_) => (
                    <li key={JSON.stringify(_)}>
                      <ArtifactReference
                        getArtifactById={getArtifactById}
                        id={_.id}
                        tooling={_.tooling}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
      <ToolBoxTitle
        title={`${definition.artifact?.name || "Definition"} properties`}
      />
      <div style={propertiesAreaStyle}>
        <PropertyInspector
          definition={definition}
          getArtifactById={getArtifactById}
        />
      </div>
    </>
  );
}
