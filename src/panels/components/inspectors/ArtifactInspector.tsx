import React from "react";

import { taxonomy } from "../../../ttf/protobufs";

import AnyArtifact from "../AnyArtifact";
import ArtifactReference from "../ArtifactReference";
import ArtifactSymbolBox from "../ArtifactSymbolBox";
import ArtifactType from "../ArtifactType";
import BehaviorGroupInspector from "./BehaviorGroupInspector";
import BehaviorInspector from "./BehaviorInspector";
import PropertySetInspector from "./PropertySetInspector";
import TemplateDefinitionInspector from "./TemplateDefinitionInspector";
import TokenBaseInspector from "./TokenBaseInspector";

type Props = {
  taxonomy: taxonomy.model.ITaxonomy;
  artifact?: AnyArtifact;
  artifactType?: ArtifactType;
};

export default function ArtifactInspector({
  taxonomy,
  artifact,
  artifactType,
}: Props) {
  if (!artifact || !artifact.artifact) {
    return <></>;
  }
  let specificTypeInspector = <></>;
  switch (artifactType) {
    case "behavior":
      specificTypeInspector = (
        <BehaviorInspector
          taxonomy={taxonomy}
          artifact={artifact as taxonomy.model.core.IBehavior}
        />
      );
      break;
    case "behavior-group":
      specificTypeInspector = (
        <BehaviorGroupInspector
          taxonomy={taxonomy}
          artifact={artifact as taxonomy.model.core.IBehaviorGroup}
        />
      );
      break;
    case "property-set":
      specificTypeInspector = (
        <PropertySetInspector
          taxonomy={taxonomy}
          artifact={artifact as taxonomy.model.core.IPropertySet}
        />
      );
      break;
    case "token-base":
      specificTypeInspector = (
        <TokenBaseInspector
          artifact={artifact as taxonomy.model.core.IBase}
        />
      );
      break;
    case "template-definition":
      specificTypeInspector = (
        <TemplateDefinitionInspector
          taxonomy={taxonomy}
          artifact={artifact as taxonomy.model.core.ITemplateDefinition}
        />
      );
      break;
  }
  const core = artifact.artifact;
  return (
    <>
      {!!core.aliases?.length && (
        <p>
          <b>Aliases: {core.aliases.join(", ")}</b>
        </p>
      )}
      {!core.aliases?.length && <p></p>}
      {!!core.artifactSymbol && (
        <ArtifactSymbolBox symbol={core.artifactSymbol} />
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
      {!!core.artifactDefinition?.analogies?.length && (
        <div>
          <u>Analogies:</u>
          <ul>
            {core.artifactDefinition?.analogies.map((_) => (
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
      {!!core.contributors?.length && (
        <div>
          <u>Contributors:</u>
          <ul>
            {core.contributors.map((_) => (
              <li key={JSON.stringify(_)}>
                {_.name}
                {_.name && _.organization && <>, </>}
                <i>{_.organization}</i>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!core.dependencies?.length && (
        <div>
          <u>Dependencies:</u>
          <ul>
            {core.dependencies.map((_) => (
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
      {!!core.influencedBySymbols?.length && (
        <div>
          <u>Influenced by:</u>
          <ul>
            {core.influencedBySymbols.map((_) => (
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
      {!!core.incompatibleWithSymbols?.length && (
        <div>
          <u>Incompatible with:</u>
          <ul>
            {core.incompatibleWithSymbols.map((_) => (
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
      {specificTypeInspector}
    </>
  );
}
