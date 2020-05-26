import React from "react";

import ArtifactReference from "./ArtifactReference";
import ToolBoxTitle from "./ToolBoxTitle";

import { IArtifactAsObject } from "../../ttfInterface";

type Props = {
  artifact: IArtifactAsObject;
  getArtifactById: (
    id: string,
    tooling?: string
  ) => IArtifactAsObject | undefined;
};

export default function ArtifactInspector({
  artifact,
  getArtifactById,
}: Props) {
  const descriptionAreaStyle: React.CSSProperties = {
    maxHeight: "45vh",
    overflowY: "auto",
    margin: "var(--padding)",
    padding: "var(--padding)",
  };
  const propertiesAreaStyle: React.CSSProperties = {
    maxHeight: "45vh",
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
      <ToolBoxTitle title={artifact.name} />
      <div style={descriptionAreaStyle}>
        {!!artifact.aliasesList?.length && (
          <p>
            <b>Aliases: {artifact.aliasesList.join(", ")}</b>
          </p>
        )}
        {!artifact.aliasesList?.length && <p></p>}
        {!!artifact.artifactSymbol?.tooling && (
          <span style={badgeStyle}>{artifact.artifactSymbol?.tooling}</span>
        )}
        {artifact.artifactDefinition?.businessDescription && (
          <p>{artifact.artifactDefinition?.businessDescription}</p>
        )}
        {artifact.artifactDefinition?.businessExample && (
          <p>
            For example: <i>{artifact.artifactDefinition?.businessExample}</i>
          </p>
        )}
        {artifact.artifactDefinition?.comments && (
          <p>
            <i>Note:</i> {artifact.artifactDefinition?.comments}
          </p>
        )}
        {!!artifact.artifactDefinition?.analogiesList?.length && (
          <div>
            <u>Analogies:</u>
            <ul>
              {artifact.artifactDefinition?.analogiesList.map((_) => (
                <li key={JSON.stringify(_)}>
                  {_.name}
                  <ul>
                    <li>{_.description}</li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!artifact.contributorsList?.length && (
          <div>
            <u>Contributors:</u>
            <ul>
              {artifact.contributorsList.map((_) => (
                <li key={JSON.stringify(_)}>
                  {_.name}
                  {_.name && _.organization && <>, </>}
                  <i>{_.organization}</i>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!!artifact.dependenciesList?.length && (
          <div>
            <u>Dependencies:</u>
            <ul>
              {artifact.dependenciesList.map((_) => (
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
        {!!artifact.influencedBySymbolsList?.length && (
          <div>
            <u>Influenced by:</u>
            <ul>
              {artifact.influencedBySymbolsList.map((_) => (
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
        {!!artifact.incompatibleWithSymbolsList?.length && (
          <div>
            <u>Incompatible with:</u>
            <ul>
              {artifact.incompatibleWithSymbolsList.map((_) => (
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
      <div style={propertiesAreaStyle}>TODO: Show properties</div>
    </>
  );
}
