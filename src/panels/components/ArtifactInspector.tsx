import React from "react";

import AnyArtifact from "./AnyArtifact";
import ArtifactReference from "./ArtifactReference";
import ArtifactType from "./ArtifactType";
import { TaxonomyAsObjects } from "../taxonomyAsObjects";

type Props = {
  taxonomy: TaxonomyAsObjects;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
};

export default function ArtifactInspector({
  taxonomy,
  artifact,
  artifactType,
}: Props) {
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
  if (!artifact || !artifact.artifact) {
    return <></>;
  }
  const core = artifact.artifact;
  return (
    <>
      {!!core.aliasesList?.length && (
        <p>
          <b>Aliases: {core.aliasesList.join(", ")}</b>
        </p>
      )}
      {!core.aliasesList?.length && <p></p>}
      {!!core.artifactSymbol?.tooling && (
        <span style={badgeStyle}>{core.artifactSymbol?.tooling}</span>
      )}
      {core.artifactDefinition?.businessDescription && (
        <p>{core.artifactDefinition?.businessDescription}</p>
      )}
      {core.artifactDefinition?.businessExample && (
        <p>
          For example: <i>{core.artifactDefinition?.businessExample}</i>
        </p>
      )}
      {core.artifactDefinition?.comments && (
        <p>
          <i>Note:</i> {core.artifactDefinition?.comments}
        </p>
      )}
      {!!core.artifactDefinition?.analogiesList?.length && (
        <div>
          <u>Analogies:</u>
          <ul>
            {core.artifactDefinition?.analogiesList.map((_) => (
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
      {!!core.contributorsList?.length && (
        <div>
          <u>Contributors:</u>
          <ul>
            {core.contributorsList.map((_) => (
              <li key={JSON.stringify(_)}>
                {_.name}
                {_.name && _.organization && <>, </>}
                <i>{_.organization}</i>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.dependenciesList?.length && (
        <div>
          <u>Dependencies:</u>
          <ul>
            {core.dependenciesList.map((_) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.symbol?.id}
                  tooling={_.symbol?.tooling}
                />
                {_.description && <> ({_.description})</>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.influencedBySymbolsList?.length && (
        <div>
          <u>Influenced by:</u>
          <ul>
            {core.influencedBySymbolsList.map((_) => (
              <li key={JSON.stringify(_)}>
                <b>
                  <ArtifactReference
                    taxonomy={taxonomy}
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
      {!!core.incompatibleWithSymbolsList?.length && (
        <div>
          <u>Incompatible with:</u>
          <ul>
            {core.incompatibleWithSymbolsList.map((_) => (
              <li key={JSON.stringify(_)}>
                <ArtifactReference
                  taxonomy={taxonomy}
                  id={_.id}
                  tooling={_.tooling}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
